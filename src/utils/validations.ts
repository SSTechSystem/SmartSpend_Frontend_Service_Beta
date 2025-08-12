import {
  API_URL_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  POSTCODE_REGEX,
  PREFIX_REGEX,
} from "./constants";

export const validateCompanyInfo = (formData: any) => {
  let errors: any = {};
  const name = formData.get("name");
  const building_name = formData.get("building_name");
  const city = formData.get("city");
  const email = formData.get("email");
  let zipcode = formData.get("zipcode");
  const company_prefix = formData.get("company_prefix");
  const help_line_number = formData.get("help_line_number");
  // const street_address = formData.get("street_address");

  if (!name) {
    errors.name = "Name is required";
  } else if (name.trim().length === 0) {
    errors.name = "Name cannot be whitespace only";
  }
  // else if (!USERNAME_REGEX.test(name)) {
  //   errors.name = "Invalid Name";
  // }
  else if (name.length < 3) {
    errors.name = "Name must have at least 3 characters";
  }

  if (!building_name) {
    errors.building_name = "Building Name is required";
  } else if (building_name.trim().length === 0) {
    errors.building_name = "Building Name cannot be whitespace only";
  }
  // else if (!ADDRESS_REGEX.test(building_name)) {
  //   errors.building_name = "Invalid Building Name";
  // }
  else if (building_name.length < 3) {
    errors.building_name = "Building name must be at least 3 characters long.";
  }

  // if (street_address && !ADDRESS_REGEX.test(street_address)) {
  //   errors.street_address = "Invalid Street Address";
  // }

  if (!city) {
    errors.city = "City is required";
  } else if (city.trim().length === 0) {
    errors.city = "City cannot be whitespace only";
  }
  // else if (!NAME_REGEX.test(city)) {
  //   errors.city = "Invalid city name";
  // }

  if (!zipcode) {
    errors.zipcode = "Zipcode is required";
  } else {
    if (zipcode.trim().length === 0) {
      errors.zipcode = "Zipcode cannot be whitespace only";
    } else if (!POSTCODE_REGEX.test(zipcode)) {
      errors.zipcode = "Invalid zipcode format";
    }
  }

  if (!help_line_number) {
    errors.help_line_number = "Contact Number is required";
  } else if (help_line_number.trim().length === 0) {
    errors.help_line_number = "Contact Number cannot be whitespace only";
  } else if (!PHONE_REGEX.test(help_line_number)) {
    errors.help_line_number = "Contact Number is not valid";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (email.trim().length === 0) {
    errors.email = "Email can not be whitespace only";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Email is not valid";
  }

  if (!company_prefix) {
    errors.company_prefix = "Prefix Name is required";
  } else if (company_prefix.trim().length === 0) {
    errors.company_prefix = "Prefix Name cannot be whitespace only";
  } else if (company_prefix.length < 3 || company_prefix.length > 3) {
    errors.company_prefix = "Prefix Name must be of 3 characters";
  } else if (!PREFIX_REGEX.test(company_prefix)) {
    errors.company_prefix =
      "Prefix Name can only contain alphabetic characters without any whitespaces";
  }

  return errors;
};

export const validateAccountsInfo = (formData: any) => {
  let errors: any = {};
  const name = formData.get("name");
  const building_name = formData.get("building_name");
  const suburb = formData.get("suburb");
  const pincode = formData.get("pincode");
  const contact_no = formData.get("contact_no");
  const email = formData.get("email");
  // const street_address = formData.get("street_address");
  const site_url = formData.get("site_url");

  if (!name) {
    errors.name = "Name is required";
  } else if (name.trim().length === 0) {
    errors.name = "Name cannot be whitespace only";
  }
  // else if (!USERNAME_REGEX.test(name)) {
  //   errors.name = "Invalid Name";
  // }
  else if (name.length < 3) {
    errors.name = "Name must have at least 3 characters";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (email.trim().length === 0) {
    errors.email = "Email can not be whitespace only";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Email is not valid";
  }

  if (!building_name) {
    errors.building_name = "Building Name is required";
  } else if (building_name.trim().length === 0) {
    errors.building_name = "Building Name cannot be whitespace only";
  }
  // else if (!ADDRESS_REGEX.test(building_name)) {
  //   errors.building_name = "Invalid building name";
  // }
  else if (building_name.length < 3) {
    errors.building_name = "Building name must be at least 3 characters long.";
  }

  // if (street_address && !ADDRESS_REGEX.test(street_address)) {
  //   errors.street_address = "Invalid Street Address";
  // }

  if (!suburb) {
    errors.suburb = "City is required";
  } else if (suburb.trim().length === 0) {
    errors.suburb = "City cannot be whitespace only";
  }
  // else if (!NAME_REGEX.test(suburb)) {
  //   errors.suburb = "Invalid city name";
  // }

  if (!pincode) {
    errors.pincode = "Pincode is required";
  } else if (pincode.trim().length === 0) {
    errors.pincode = "Pincode cannot be whitespace only";
  } else if (!POSTCODE_REGEX.test(pincode)) {
    errors.pincode = "Invalid pincode format";
  }

  if (!contact_no) {
    errors.contact_no = "Contact Number is required";
  } else if (contact_no.trim().length === 0) {
    errors.contact_no = "Contact Number cannot be whitespace only";
  } else if (!PHONE_REGEX.test(contact_no)) {
    errors.contact_no = "Contact Number is not valid";
  }

  if (site_url && !API_URL_REGEX.test(site_url)) {
    errors.site_url = "Please enter a valid URL1111";
  }

  return errors;
};

export const validateUserInfo = (formData: any) => {
  let errors: any = {};
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const city = formData.get("city");
  const building_name = formData.get("building_name");
  const pincode = formData.get("pincode");
  const contact_no = formData.get("contact_no");
  // const street_address = formData.get("street_address");
  // const confirmPassword = formData.get("confirmPassword");

  if (!name) {
    errors.name = "Name is required";
  } else if (name.trim().length === 0) {
    errors.name = "Name cannot be whitespace only";
  }
  // else if (!USERNAME_REGEX.test(name)) {
  //   errors.name = "Invalid Name";
  // }
  else if (name.length < 3) {
    errors.name = "Name must have at least 3 characters";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (email.trim().length === 0) {
    errors.email = "Email cannot be whitespace only";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Email is not valid";
  }

  if (!building_name) {
    errors.building_name = "Building Name is required";
  } else if (building_name.trim().length === 0) {
    errors.building_name = "Building Name cannot be whitespace only";
  }
  // else if (!ADDRESS_REGEX.test(building_name)) {
  //   errors.building_name = "Invalid building name";
  // }
  else if (building_name.length < 3) {
    errors.building_name = "Building name must be at least 3 characters long.";
  }

  // if (street_address && !ADDRESS_REGEX.test(street_address)) {
  //   errors.street_address = "Invalid Street Address";
  // }

  if (!pincode) {
    errors.pincode = "Pincode is required";
  } else if (pincode.trim().length === 0) {
    errors.pincode = "Pincode cannot be whitespace only";
  } else if (!POSTCODE_REGEX.test(pincode)) {
    errors.pincode = "Invalid pincode format";
  }

  if (!contact_no) {
    errors.contact_no = "Contact Number is required";
  } else if (contact_no.trim().length === 0) {
    errors.contact_no = "Contact Number cannot be whitespace only";
  } else if (!PHONE_REGEX.test(contact_no)) {
    errors.contact_no = "Contact Number is not valid";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.trim().length === 0) {
    errors.password = "Password cannot be whitespace only";
  }

  if (!city) {
    errors.city = "City is required";
  } else if (city.trim().length === 0) {
    errors.city = "City cannot be whitespace only";
  }
  // else if (!NAME_REGEX.test(city)) {
  //   errors.city = "Invalid city name";
  // }

  // if (!confirmPassword) {
  //   errors.confirmPassword = "Confirm Password is required";
  // } else if (confirmPassword.trim().length === 0) {
  //   errors.confirmPassword = "Confirm Password cannot be whitespace only";
  // } else if (password !== confirmPassword) {
  //   errors.confirmPassword = "Passwords do not match";
  // }

  return errors;
};
