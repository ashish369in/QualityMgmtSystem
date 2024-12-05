# Quality Management System - Manual Test Cases

## Authentication Tests

### Login Flow
1. **Test Case: Successful Login**
   - Navigate to /login
   - Select a user from the dropdown
   - Verify redirect to dashboard
   - Verify user info displayed in header

2. **Test Case: Authentication Persistence**
   - Login successfully
   - Refresh the page
   - Verify user remains logged in
   - Verify token exists in localStorage

3. **Test Case: Logout Flow**
   - Click logout button
   - Verify redirect to login page
   - Verify token removed from localStorage
   - Verify protected routes are inaccessible

## Issue Management Tests

### Create Issue
1. **Test Case: Create Issue with Required Fields**
   - Click "Create Issue" button
   - Fill in title and description
   - Submit form
   - Verify success toast appears
   - Verify issue appears in list

2. **Test Case: Create Issue with Defects**
   - Click "Create Issue" button
   - Fill in title and description
   - Select multiple defects
   - Submit form
   - Verify defects are linked to issue

3. **Test Case: Form Validation**
   - Click "Create Issue" button
   - Leave title empty
   - Submit form
   - Verify error message
   - Verify form doesn't submit

### Edit Issue
1. **Test Case: Edit Issue Details**
   - Open existing issue
   - Click edit button
   - Modify title and description
   - Submit changes
   - Verify success toast
   - Verify changes reflected

2. **Test Case: Update Issue Status**
   - Open existing issue
   - Click edit button
   - Change status
   - Submit changes
   - Verify status updated
   - Verify history tracked

### View Issue
1. **Test Case: Issue Details Display**
   - Open existing issue
   - Verify title, description visible
   - Verify status displayed
   - Verify creator info shown
   - Verify linked defects listed
   - Verify tasks displayed

## Task Management Tests

### Create Task
1. **Test Case: Create Task in Issue**
   - Open existing issue
   - Click "Create Task"
   - Fill in details
   - Assign to user
   - Submit form
   - Verify task appears

2. **Test Case: Task Assignment**
   - Create new task
   - Select assignee
   - Submit form
   - Verify assignee set correctly
   - Verify task appears in assignee's list

## User Management Tests (Quality Role Only)

### User Operations
1. **Test Case: View Users List**
   - Login as Quality user
   - Navigate to Users page
   - Verify user list visible
   - Verify user details displayed

2. **Test Case: Role-Based Access**
   - Login as non-Quality user
   - Verify Users menu not visible
   - Try accessing /users directly
   - Verify access denied

## Navigation Tests

1. **Test Case: Menu Navigation**
   - Click each menu item
   - Verify correct page loads
   - Verify active menu highlighted
   - Verify breadcrumb updates

2. **Test Case: Direct URL Access**
   - Access each route directly by URL
   - Verify correct page loads
   - Verify authentication required
   - Verify role-based access

## Error Handling Tests

1. **Test Case: Network Error Handling**
   - Disable network
   - Perform CRUD operations
   - Verify error messages
   - Verify UI remains functional

2. **Test Case: Invalid Data Handling**
   - Submit invalid data in forms
   - Verify validation messages
   - Verify form state preserved
   - Verify recovery possible

## Performance Tests

1. **Test Case: Load Time**
   - Measure initial page load
   - Measure navigation time
   - Verify no UI freezes
   - Check memory usage

2. **Test Case: Data Loading**
   - Load large lists
   - Verify smooth scrolling
   - Check pagination works
   - Verify data caching
