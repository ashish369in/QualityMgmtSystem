# Quality Management System Tests

This directory contains both manual and automated tests for the Quality Management System.

## Structure

```
tests/
├── automated/           # Playwright automated tests
│   ├── auth.test.ts    # Authentication tests
│   ├── issues.test.ts  # Issue management tests
│   └── users.test.ts   # User management tests
├── manual/             # Manual test cases
│   └── test-cases.md   # Detailed manual test scenarios
└── README.md           # This file
```

## Running Automated Tests

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

3. Start the development server:
```bash
npm run dev
```

4. Run the tests:
```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test auth.test.ts

# Run tests in headed mode
npx playwright test --headed

# Run tests in specific browser
npx playwright test --project=Chrome
```

## Test Coverage

### Automated Tests
- Authentication flows
- Issue management (CRUD operations)
- User management (CRUD operations)
- Form validations
- Error handling
- Role-based access control

### Manual Tests
- Detailed user interaction scenarios
- Visual verification
- Performance testing
- Error handling edge cases
- Cross-browser compatibility

## Best Practices

1. **Test Independence**
   - Each test should be independent
   - Clean up test data after each run
   - Don't rely on other tests' state

2. **Reliable Selectors**
   - Use data-testid attributes when possible
   - Avoid brittle selectors like CSS classes
   - Use text content for user-facing elements

3. **Error Handling**
   - Test both success and failure cases
   - Verify error messages
   - Check boundary conditions

4. **Performance**
   - Keep tests focused and minimal
   - Use appropriate timeouts
   - Clean up resources

## Contributing

When adding new tests:

1. Follow the existing structure
2. Add appropriate comments
3. Update this README if needed
4. Run the full test suite before committing

## Maintenance

- Regular review of test coverage
- Update tests when features change
- Remove obsolete tests
- Keep dependencies updated
