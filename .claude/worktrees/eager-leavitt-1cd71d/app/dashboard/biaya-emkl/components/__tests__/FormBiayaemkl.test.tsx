import '@testing-library/jest-dom';
import Form from '../FormBiayaemkl';
import { BiayaemklSchema } from '@/lib/validations/biayaemkl.validation';
import {
  renderForm,
  getBtn,
  saveButton,
  userEvent,
  buildValidObject,
  screen
} from '@/lib/test-utils/formHarness';
import { REQUIRED_FIELD } from '@/constants/validation';

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

const schema = BiayaemklSchema;
const validData = buildValidObject(schema);

describe('FormBiayaemkl', () => {
  test('renders SAVE and Cancel buttons', () => {
    renderForm(Form, { schema, defaultValues: validData });
    expect(saveButton()).toBeInTheDocument();
    expect(getBtn('Cancel')).toBeInTheDocument();
  });

  test('does not submit an invalid (empty) form', async () => {
    const { onValid } = renderForm(Form, { schema });
    await userEvent.click(saveButton());
    await new Promise((r) => setTimeout(r, 0));
    expect(onValid).not.toHaveBeenCalled();
  });

  // LookUp tidak dibungkus FormField, jadi error-nya dulu tidak pernah tampil dan
  // SAVE terlihat seperti tidak melakukan apa-apa.
  test('shows validation messages for the lookup fields', async () => {
    // String kosong, seperti state form add yang sebenarnya — bukan undefined,
    // supaya zod memakai pesan min(1) dan bukan "Required".
    const emptyAddForm = {
      nama: '',
      keterangan: '',
      biaya_id: '',
      coahut: '',
      jenisorder_id: '',
      statusaktif: '',
      statusbiayabl: '',
      statusseal: '',
      statustagih: ''
    };

    const { onValid } = renderForm(Form, {
      schema,
      defaultValues: emptyAddForm
    });
    await userEvent.click(saveButton());

    const messages = await screen.findAllByText(REQUIRED_FIELD);
    expect(messages.length).toBeGreaterThan(0);
    expect(onValid).not.toHaveBeenCalled();
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
