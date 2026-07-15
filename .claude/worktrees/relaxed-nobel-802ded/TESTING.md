# Testing Guide

## Setup

Project ini menggunakan Jest dan React Testing Library untuk unit testing dan integration testing.

### Dependencies

- **Jest**: Framework testing
- **@testing-library/react**: Testing utilities untuk React components
- **@testing-library/jest-dom**: Custom matchers untuk DOM
- **@testing-library/user-event**: User interaction simulation
- **jest-environment-jsdom**: DOM environment untuk Jest

## Running Tests

### Run all tests

```bash
npm test
```

### Watch mode (auto re-run on file changes)

```bash
npm run test:watch
```

### Generate coverage report

```bash
npm run test:coverage
```

### CI/CD testing

```bash
npm run test:ci
```

### Update snapshots

```bash
npm run test:update
```

## Writing Tests

### Test File Structure

```
src/
├── components/
│   └── ui/
│       ├── button.tsx
│       └── __tests__/
│           └── button.test.tsx
├── lib/
│   └── utils/
│       ├── index.ts
│       └── __tests__/
│           └── parseCurrency.test.ts
└── hooks/
    ├── use-debounce.tsx
    └── __tests__/
        └── use-debounce.test.ts
```

### Example: Component Test

```typescript
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Example: Utility Function Test

```typescript
import { parseCurrency } from '../utils';

describe('parseCurrency', () => {
  test('should parse Indonesian currency format', () => {
    expect(parseCurrency('100.000,00')).toBe('100000.00');
  });

  test('should handle empty input', () => {
    expect(parseCurrency('')).toBe('0');
  });
});
```

### Example: Hook Test

```typescript
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../use-debounce';

describe('useDebounce Hook', () => {
  jest.useFakeTimers();

  test('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });
});
```

### Example: Redux Slice Test

```typescript
import reducer, { setHeaderData, clearHeaderData } from '../headerSlice';

describe('Header Slice', () => {
  test('should handle setHeaderData', () => {
    const testData = { id: 1, nobukti: 'TEST-001' };
    const state = reducer(undefined, setHeaderData(testData));
    expect(state.headerData).toEqual(testData);
  });
});
```

## Mocking

### Mock Next.js Router

```typescript
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      pathname: '/'
    };
  }
}));
```

### Mock API Calls

```typescript
jest.mock('@/lib/utils/AxiosInstance', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));
```

### Mock React Query

```typescript
import { QueryClient, QueryClientProvider } from 'react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
```

## Best Practices

1. **Test Behavior, Not Implementation**

   - Focus on what the user sees and does
   - Don't test internal state or implementation details

2. **Use Descriptive Test Names**

   ```typescript
   test('should display error message when form submission fails', () => {
     // test code
   });
   ```

3. **Arrange-Act-Assert Pattern**

   ```typescript
   test('example test', () => {
     // Arrange: Setup
     const value = 'test';

     // Act: Execute
     const result = myFunction(value);

     // Assert: Verify
     expect(result).toBe('expected');
   });
   ```

4. **Clean Up After Tests**

   ```typescript
   afterEach(() => {
     jest.clearAllMocks();
     cleanup();
   });
   ```

5. **Avoid Testing External Libraries**
   - Don't test react-hook-form, radix-ui, etc.
   - Focus on your own business logic

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Common Testing Patterns

### Testing Forms

```typescript
import userEvent from '@testing-library/user-event';

test('form submission', async () => {
  const user = userEvent.setup();
  render(<MyForm />);

  await user.type(screen.getByLabelText('Name'), 'John Doe');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(mockSubmit).toHaveBeenCalled();
});
```

### Testing Async Operations

```typescript
import { waitFor } from '@testing-library/react';

test('loads data', async () => {
  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument();
  });
});
```

### Testing Error States

```typescript
test('displays error message', () => {
  render(<ComponentWithError error="Something went wrong" />);

  expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
});
```

## Debugging Tests

### Run specific test file

```bash
npm test -- button.test.tsx
```

### Run tests matching pattern

```bash
npm test -- --testNamePattern="should render"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

## Automated suite: model & form tests

Two reusable helpers keep coverage consistent across every dashboard module
(pattern established by `alat-bayar`):

### Model (schema) tests — `lib/test-utils/schemaContract.ts`

`runModuleSchemaContract(name, module, options?)` introspects each exported Zod
schema and asserts: a generated valid object passes, every required field is
enforced, and non-objects/empty objects are rejected. Each
`lib/validations/__tests__/<name>.validation.test.ts` is just:

```ts
import * as mod from '@/lib/validations/<name>.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('<name>', mod);
```

Schemas with cross-field refinements (regex/date) pass a `validPatch`:

```ts
runModuleSchemaContract('supplier', mod, {
  supplierSchema: { validPatch: { npwp: '12.345.678.9-012.345' } }
});
```

### Form tests — `lib/test-utils/formHarness.tsx`

`renderForm(FormComponent, { schema, mode, defaultValues })` wraps a form in
Redux + react-query + `FormErrorProvider`, wires `onSubmit` through
`react-hook-form`, and mocks heavy custom-ui widgets. Helpers `getBtn`,
`saveButton` match the footer buttons (whose accessible name is "S AVE" because
the shortcut letter is underlined). Per-module form tests are produced by
`node scripts/gen-form-tests.js` (re-run after adding a module — it never
overwrites hand-written tests).

Each generated form test asserts: SAVE/Cancel render, an invalid (empty) form
does not submit, view mode disables SAVE, and Cancel calls `handleClose`.
Sub-forms / tab panels / table widgets that aren't standalone dialogs are
`describe.skip`-ped with a reason. Full valid-submission flow lives in the
detailed reference test `app/dashboard/alat-bayar/components/__tests__/FormAlatbayar.test.tsx`.

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
