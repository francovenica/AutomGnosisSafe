export const loadSafeForm = {
  form: { selector: "form[data-testid='load-safe-form']", type: 'css' },
  safe_name_field: { selector: "input[data-testid='load-safe-name-field']", type: 'css' },
  safe_address_field: { selector: "input[data-testid='load-safe-address-field']", type: 'css' },
  valid_address: { selector: "svg[data-testid='valid-address']", type: 'css' },
  step_two: { selector: "p[data-testid='load-safe-step-two']", type: 'css' },
  owner_row: { selector: "div[data-testid='owner-row']", type: 'css' }, // all the rows, to count
  owner_name: (index = 0) => `input[data-testid='load-safe-owner-name-${index}']`,
  step_three: { selector: "p[data-testid='load-safe-step-three']", type: 'css' },
  review_safe_name: { selector: "p[data-testid='load-form-review-safe-name']", type: 'css' },
  review_owner_name: { selector: "p[data-testid='load-safe-review-owner-name']", type: 'css' },
  valid_safe_name: { selector: "//p[contains(text(),'Safe name')]", type: 'Xpath' }
}
