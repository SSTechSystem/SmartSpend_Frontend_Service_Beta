import React, { ChangeEvent } from "react";
import { FormInput, FormLabel } from "../../base-components/Form";
import Button from "../../base-components/Button";

type DynamicFieldsState = {
  id: number | string;
  description: string;
  versionNumber: string;
  platform: string;
  forceupdate: string;
  is_created?: number;
  is_updated?: number;
  is_deleted?: number;
};

type DynamicErrorState = {
  id: number | string;
  description: string;
  versionNumber: string;
  platform: string;
};

type Props = {
  dynamicFields: DynamicFieldsState[];
  dynamicFormErrors: DynamicErrorState[];
  handleDynamicInputChange: (
    id: number | string,
    field: keyof DynamicFieldsState,
    value: string | number
  ) => void;
  handleAddMoreFields: () => void;
  handleRemoveField: (id: number | string) => void;
};

const VersionHistoryFields: React.FC<Props> = ({
  dynamicFields,
  dynamicFormErrors,
  handleDynamicInputChange,
  handleAddMoreFields,
  handleRemoveField,
}) => (
  <>
    {dynamicFields.map(
      (field, index) =>
        field.is_deleted !== 1 && (
          <div
            key={field.id}
            className="col-span-12 border p-4 rounded-lg bg-gray-100"
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-4">
                <FormLabel htmlFor={`versionNumber-${field.id}`}>
                  Version Number
                  <span className="text-red-600 font-bold ms-1">*</span>
                </FormLabel>
                <FormInput
                  id={`versionNumber-${field.id}`}
                  type="text"
                  name="versionNumber"
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleDynamicInputChange(
                      field.id,
                      "versionNumber",
                      e.target.value
                    )
                  }
                  value={field.versionNumber || ""}
                />
                {dynamicFormErrors.find((error) => error.id === field.id)
                  ?.versionNumber && (
                  <p className="mt-1 text-xs text-red-500">
                    {
                      dynamicFormErrors.find(
                        (error) => error.id === field.id
                      )?.versionNumber
                    }
                  </p>
                )}
              </div>
              <div className="col-span-12 sm:col-span-4">
                <FormLabel htmlFor={`platform-${field.id}`}>
                  Platform
                  <span className="text-red-600 font-bold ms-1">*</span>
                </FormLabel>
                <select
                  id={`platform-${field.id}`}
                  name="platform"
                  value={field.platform}
                  onChange={(e) =>
                    handleDynamicInputChange(
                      field.id,
                      "platform",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                >
                  <option value="">Select Platform</option>
                  <option value="ios">IOS</option>
                  <option value="android">Android</option>
                </select>
                {dynamicFormErrors.find((error) => error.id === field.id)
                  ?.platform && (
                  <p className="mt-1 text-xs text-red-500">
                    {
                      dynamicFormErrors.find(
                        (error) => error.id === field.id
                      )?.platform
                    }
                  </p>
                )}
              </div>
              <div className="col-span-12 sm:col-span-4">
                <FormLabel htmlFor={`forceupdate-${field.id}`}>
                  Select Force Update
                </FormLabel>
                <select
                  id={`forceupdate-${field.id}`}
                  name="forceupdate"
                  value={field.forceupdate}
                  onChange={(e) =>
                    handleDynamicInputChange(
                      field.id,
                      "forceupdate",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                >
                  <option value="1">True</option>
                  <option value="0">False</option>
                </select>
              </div>
              <div className="col-span-12">
                <FormLabel htmlFor={`description-${field.id}`}>
                  Version Description
                  <span className="text-red-600 font-bold ms-1">*</span>
                </FormLabel>
                <textarea
                  id={`description-${field.id}`}
                  name="description"
                  value={field.description}
                  onChange={(e) =>
                    handleDynamicInputChange(
                      field.id,
                      "description",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                  rows={4}
                />
                {dynamicFormErrors.find((error) => error.id === field.id)
                  ?.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {
                      dynamicFormErrors.find(
                        (error) => error.id === field.id
                      )?.description
                    }
                  </p>
                )}
              </div>
              <div className="col-span-12 flex justify-between">
                {dynamicFields.length === 1 ? (
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleAddMoreFields}
                  >
                    Add More Fields
                  </Button>
                ) : (
                  <>
                    {index < dynamicFields.length - 1 ? (
                      <Button
                        variant="primary"
                        type="button"
                        className="bg-red-600"
                        onClick={() => handleRemoveField(field.id)}
                      >
                        Remove
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          type="button"
                          className="bg-red-600"
                          onClick={() => handleRemoveField(field.id)}
                        >
                          Remove
                        </Button>
                        <Button
                          variant="primary"
                          type="button"
                          onClick={handleAddMoreFields}
                        >
                          Add More Fields
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )
    )}
  </>
);

export default VersionHistoryFields;