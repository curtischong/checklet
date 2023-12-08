// determines the maximum number of chars for each input box in the app. the frontend and backend uses these values for validation
export const MAX_EDITOR_LEN = 4000 * 3.5; // 4k tokens * 3.5 chars per token
// we need to reserve some characters because of the system prompt (includes positive examples)

export const MAX_CHECKER_DESC_LEN = 700;
export const MAX_CHECKER_NAME_LEN = 150;

export const MAX_CHECK_NAME_LEN = 100;
export const MAX_CHECK_DESC_LEN = 700;
export const MAX_CHECK_INSTR_LEN = 1500;
export const MAX_CHECK_CATEGORY_LEN = 100;
export const MAX_POSITIVE_EX_ORIGINAL_TEXT_LEN = 500;
export const MAX_POSITIVE_EX_EDITED_TEXT_LEN = 500;
