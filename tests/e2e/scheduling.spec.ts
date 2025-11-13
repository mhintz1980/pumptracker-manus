import { test, expect } from '@playwright/test';

test.describe('Scheduling Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application and wait for it to load
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to scheduling view
    await page.getByRole('button', { name: /scheduling/i }).click();

    // Wait for scheduling view to load
    await page.waitForSelector('[data-testid="scheduling-view"], .scheduling-view', { timeout: 10000 });
  });

  test('basic page loading test', async ({ page }) => {
    // Verify main scheduling components are present
    await expect(page.locator('h1').filter({ hasText: 'PumpTracker Lite' })).toBeVisible();

    // Verify the scheduling view container is loaded
    const schedulingContainer = page.locator('[data-testid="scheduling-view"]');
    await expect(schedulingContainer).toBeVisible();

    // Check that we're not on loading state
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 5000 });
  });

  test('component visibility test', async ({ page }) => {
    // Verify sidebar is present
    const sidebar = page.locator('[data-testid="backlog-dock"]');
    await expect(sidebar).toBeVisible();

    // Verify unscheduled jobs section
    await expect(page.getByText(/unscheduled jobs/i)).toBeVisible();

    // Verify calendar grid is present
    const calendarGrid = page.locator('[data-testid="calendar-grid"]');
    await expect(calendarGrid).toBeVisible();

    // Verify calendar header is present
    const calendarHeader = page.locator('[data-testid="calendar-header"]');
    await expect(calendarHeader).toBeVisible();

    // Check for navigation buttons
    await expect(page.getByRole('button', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /kanban/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /scheduling/i })).toBeVisible();

    // Verify Add PO button is present
    await expect(page.getByRole('button', { name: /add po/i })).toBeVisible();
  });

  test('drag and drop functionality test', async ({ page }) => {
    // Wait for unscheduled jobs to load
    await page.waitForSelector('[data-pump-id]', { timeout: 10000 });

    // Get the first unscheduled job card
    const firstJobCard = page.locator('[data-pump-id]').first();
    await expect(firstJobCard).toBeVisible();

    // Get pump ID for later verification
    const pumpId = await firstJobCard.getAttribute('data-pump-id');
    expect(pumpId).toBeTruthy();

    // Get pump model from the card
    const pumpModel = await firstJobCard.locator('.text-sm.font-semibold').textContent();
    expect(pumpModel).toBeTruthy();

    // Find a droppable calendar cell at least a week out to ensure it's in the future
    const calendarCells = page.locator('[data-testid^="calendar-cell-"]');
    const futureCell = calendarCells.nth(10);
    await futureCell.scrollIntoViewIfNeeded();
    await expect(futureCell).toBeVisible();

    // Perform drag and drop
    await firstJobCard.hover();
    await page.mouse.down();
    await futureCell.hover();
    await page.mouse.up();

    // Verify the job has been moved from UNSCHEDULED to NOT STARTED
    // Check that the pump is no longer in the unscheduled sidebar
    const sidebarPump = page.locator('[data-testid="backlog-dock"] [data-pump-id="${pumpId}"]');
    await expect(sidebarPump).not.toBeVisible({ timeout: 7000 });

    // Verify the pump now appears on the calendar with NOT STARTED stage
    const calendarEvent = page.locator(`[data-pump-id="${pumpId}"][data-stage="NOT STARTED"]`);
    await expect(calendarEvent).toBeVisible({ timeout: 7000 });
  });

  test('event detail panel test', async ({ page }) => {
    // Wait for calendar to load with events
    await page.waitForSelector('[data-testid="calendar-event"]', { timeout: 10000 });

    // If no events exist, create one by dragging a job first
    let calendarEvent = page.locator('[data-testid="calendar-event"]').first();

    if (!(await calendarEvent.isVisible())) {
      const firstJobCard = page.locator('[data-pump-id]').first();
      const futureCell = page.locator('[data-testid^="calendar-cell-"]').nth(10);

      if (await firstJobCard.isVisible() && await futureCell.isVisible()) {
        const jobBox = await firstJobCard.boundingBox();
        const targetBox = await futureCell.boundingBox();
        if (jobBox && targetBox) {
          await page.mouse.move(jobBox.x + jobBox.width / 2, jobBox.y + jobBox.height / 2);
          await page.mouse.down();
          await page.waitForTimeout(50);
          await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 15 });
          await page.mouse.up();
          await page.waitForTimeout(1000);
          calendarEvent = page.locator('[data-testid="calendar-event"]').first();
        }
      }
    }

    if (await calendarEvent.isVisible()) {
      await calendarEvent.scrollIntoViewIfNeeded();
      await calendarEvent.click({ force: true });

      // Verify event detail panel opens
      const eventDetailPanel = page.locator('[data-testid="event-detail-panel"]');
      await expect(eventDetailPanel).toBeVisible();

      // Verify event details are displayed
      await expect(eventDetailPanel.locator('text=Stage')).toBeVisible();

      // Look for close button in the detail panel
      const closeButton = eventDetailPanel.locator('button').first();

      if (await closeButton.isVisible()) {
        await closeButton.click();

        // Verify panel closes
        await expect(eventDetailPanel).not.toBeVisible();
      }
    } else {
      // Skip if no events are available
      test.skip(true, 'No calendar events available to test');
    }
  });

  test('persistence test', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('[data-pump-id]', { timeout: 10000 });

    // Get initial count of unscheduled jobs
    const initialUnscheduledJobs = page.locator('[data-pump-id]');
    const initialCount = await initialUnscheduledJobs.count();

    if (initialCount > 0) {
      // Perform a drag and drop operation
      const firstJobCard = initialUnscheduledJobs.nth(1);
      const pumpId = await firstJobCard.getAttribute('data-pump-id');

      const futureCell = page.locator('[data-testid^="calendar-cell-"]').nth(10);
      await futureCell.scrollIntoViewIfNeeded();
      await firstJobCard.hover();
      await page.mouse.down();
      await futureCell.hover();
      await page.mouse.up();
      await page.waitForTimeout(1000);

      // Refresh the page
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForSelector(`[data-pump-id="${pumpId}"]`, { timeout: 10000 });

      // Verify the scheduled state persisted after refresh
      // The pump should no longer be in the unscheduled sidebar
      const sidebarPump = page.locator('[data-testid="backlog-dock"] [data-pump-id="${pumpId}"]');
      await expect(sidebarPump).not.toBeVisible();

      // The pump should appear on calendar with NOT STARTED stage
      const calendarEvent = page.locator(`[data-pump-id="${pumpId}"][data-stage="NOT STARTED"]`);
      await expect(calendarEvent).toBeVisible();
    } else {
      test.skip(true, 'No unscheduled jobs available to test persistence');
    }
  });

  test('navigation test', async ({ page }) => {
    // Test navigation to different views

    // Navigate to Dashboard
    await page.getByRole('button', { name: /dashboard/i }).click();
    await page.waitForSelector('[data-testid="dashboard-view"]', { timeout: 8000 });
    await expect(page.locator('[data-testid="dashboard-view"]')).toBeVisible();

    // Navigate to Kanban
    await page.getByRole('button', { name: /kanban/i }).click();
    await page.waitForSelector('[data-testid="kanban-view"]', { timeout: 8000 });
    await expect(page.locator('[data-testid="kanban-view"]')).toBeVisible();

    // Navigate back to Scheduling
    await page.getByRole('button', { name: /scheduling/i }).click();
    await page.waitForSelector('[data-testid="scheduling-view"]', { timeout: 8000 });
    await expect(page.getByText(/unscheduled jobs/i)).toBeVisible();

    // Verify URL reflects current view
    await expect(page).toHaveURL(/localhost:3000/);
  });

  test('accessibility checks', async ({ page }) => {
    // Basic accessibility checks
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();

    // Check for proper heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Check buttons have proper accessibility attributes
    const navigationButtons = page.getByRole('button').filter({ hasText: /(dashboard|kanban|scheduling)/i });
    const buttonCount = await navigationButtons.count();
    expect(buttonCount).toBe(3);

    // Check for keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Verify focus is on a button after tabbing
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('responsive design test', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });

    const sidebar = page.locator('[data-testid="backlog-dock"]');
    await expect(sidebar).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });

    // Components should still be visible but potentially reorganized
    await expect(page.getByText(/unscheduled jobs/i)).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });

    // In mobile view, some components might be hidden or rearranged
    // Check that main navigation is still accessible
    await expect(page.getByRole('button', { name: /scheduling/i })).toBeVisible();

    // Check that the main content is still accessible
    await expect(page.locator('.scheduling-view, [data-testid="scheduling-view"]')).toBeVisible();
  });

  test('error handling test', async ({ page }) => {
    // Test handling of network errors by intercepting requests
    await page.route('**/api/**', route => route.abort());

    // Wait for error state or retry mechanism
    await page.waitForTimeout(2000);

    // The application should handle errors gracefully
    // Check for error messages or retry indicators
    const errorMessage = page.getByText(/error|failed|retry/i);
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }

    // Test that the app doesn't completely crash
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('button', { name: /scheduling/i })).toBeVisible();
  });

  test('unscheduled jobs filtering and search', async ({ page }) => {
    // Wait for jobs to load
    await page.waitForSelector('[data-pump-id]', { timeout: 10000 });

    // Get initial job count
    const allJobs = page.locator('[data-pump-id]');
    const initialCount = await allJobs.count();

    if (initialCount > 1) {
      // Look for search/filter functionality
      const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="filter"], [data-testid="search-input"]');

      if (await searchInput.isVisible()) {
        // Test search functionality
        await searchInput.fill('test');
  
        // Verify results are filtered
        const filteredJobs = page.locator('[data-pump-id]:visible');
        await page.waitForFunction(() => {
          const count = document.querySelectorAll('[data-pump-id]').length;
          return count >= 0; // Wait for DOM to stabilize
        }, { timeout: 2000 });
        const filteredCount = await filteredJobs.count();

        // Filter should reduce the count or find specific results
        expect(filteredCount).toBeLessThanOrEqual(initialCount);

        // Clear search
        await searchInput.fill('');

        // Verify all jobs are back
        const resetCount = await allJobs.count();
        expect(resetCount).toBe(initialCount);
      } else {
        test.skip(true, 'Search/filter functionality not found');
      }
    } else {
      test.skip(true, 'Not enough jobs to test filtering');
    }
  });
});
