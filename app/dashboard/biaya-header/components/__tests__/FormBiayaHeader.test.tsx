import '@testing-library/jest-dom';
import Form from '../FormBiayaHeader';
import { biayaHeaderSchema } from '@/lib/validations/biayaheader.validation';
import {
  renderForm,
  getBtn,
  saveButton,
  userEvent,
  buildValidObject
} from '@/lib/test-utils/formHarness';

jest.mock('@/components/custom-ui/LookUp', () =>
  require('@/lib/test-utils/uiMocks').genericComponentModule()
);
jest.mock('@/components/custom-ui/LookUpModal', () =>
  require('@/lib/test-utils/uiMocks').genericComponentModule()
);
jest.mock('@/components/custom-ui/LookUpModalPengeluaran', () =>
  require('@/lib/test-utils/uiMocks').genericComponentModule()
);
jest.mock('@/components/custom-ui/LookupModalBiayaExtra', () =>
  require('@/lib/test-utils/uiMocks').genericComponentModule()
);
jest.mock('@/components/custom-ui/InputCurrency', () =>
  require('@/lib/test-utils/uiMocks').genericComponentModule()
);
jest.mock('@/components/custom-ui/InputNumeric', () =>
  require('@/lib/test-utils/uiMocks').genericComponentModule()
);
jest.mock('@/components/custom-ui/InputDatePicker', () =>
  require('@/lib/test-utils/uiMocks').genericComponentModule()
);
jest.mock('@/components/custom-ui/InputDateTimePicker', () =>
  require('@/lib/test-utils/uiMocks').genericComponentModule()
);
jest.mock('@/components/custom-ui/InputMonthPicker', () =>
  require('@/lib/test-utils/uiMocks').genericComponentModule()
);
jest.mock('@/components/custom-ui/MultiSelect', () =>
  require('@/lib/test-utils/uiMocks').genericComponentModule()
);
jest.mock('@/components/custom-ui/FilterInput', () =>
  require('@/lib/test-utils/uiMocks').genericComponentModule()
);
jest.mock('@/components/custom-ui/calendar-check', () =>
  require('@/lib/test-utils/uiMocks').genericComponentModule()
);

const schema = biayaHeaderSchema;
const validData = buildValidObject(schema);

describe('FormBiayaHeader', () => {
  test('renders SAVE and Cancel buttons', () => {
    renderForm(Form, { schema, defaultValues: validData });
    expect(saveButton()).toBeInTheDocument();
    expect(getBtn('Cancel')).toBeInTheDocument();
  });

  test('disables SAVE in view mode', () => {
    renderForm(Form, { schema, mode: 'view', defaultValues: validData });
    expect(saveButton()).toBeDisabled();
  });

  test('cancel triggers handleClose', async () => {
    const { handleClose } = renderForm(Form, { schema, defaultValues: validData });
    await userEvent.click(getBtn('Cancel'));
    expect(handleClose).toHaveBeenCalled();
  });
});
