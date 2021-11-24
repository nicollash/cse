import { jsx } from "@emotion/react";
import { FunctionComponent, useEffect } from "react";
import { useFormik, FormikProvider } from "formik";

import {
  Modal,
  FormGroup,
  Button,
  Text,
  FormikInput,
  Hr,
  FormikSpinner,
  FormikDatePicker,
} from "~/frontend/components";
import { utils } from "~/frontend/styles";
import { QuoteDetail, VehicleInfo } from "~/types";

import { styles } from "./styles";
import { useLocale } from "~/frontend/hooks";

interface Props {
  isOpen: boolean;
  defaultValue: QuoteDetail;
  onCloseModal?: () => any;
  onUpdate?: (v: QuoteDetail) => any;
}

export const RequiredInformationModal: FunctionComponent<Props> = ({
  isOpen,
  defaultValue,
  onCloseModal,
  onUpdate,
}) => {
  const { messages } = useLocale();

  const formik = useFormik<{ info: QuoteDetail }>({
    validationSchema: null,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: false,
    initialValues: {
      info: defaultValue,
    },
    onSubmit: (value) => {
      onUpdate(value.info);
      onCloseModal();
    },
  });

  useEffect(() => {
    if (isOpen) {
      (window as any).ga &&
        (window as any).ga("send", "Required Information Modal View");
    }
  }, [isOpen]);

  useEffect(() => {
    if (defaultValue) {
      formik.setValues({
        info: defaultValue,
      });
    }
  }, [defaultValue]);

  if (!defaultValue) {
    return <div />;
  }

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      title={messages.RequiredInformation.Heading}
      onCloseModal={onCloseModal}
      width="800px"
    >
      <FormikProvider value={formik}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
          css={styles.form}
        >
          {formik.values.info.vehicles.map(
            (info, key) =>
              info.status === "Active" && (
                <div key={key}>
                  {!defaultValue.vehicles[key]?.vinNumber && (
                    <div
                      css={[
                        utils.display("flex"),
                        utils.alignItems("center"),
                        styles.row,
                      ]}
                    >
                      <Text
                        bold
                        css={[utils.mr(5), utils.ml(2), utils.width("200px")]}
                      >
                        {info.model}
                      </Text>
                      <FormGroup
                        label={messages.Common.VIN}
                        css={styles.formGroup}
                      >
                        <FormikInput
                          name={`info.vehicles.${key}.vinNumber`}
                          css={[utils.mb(3), utils.mx(2), utils.fullWidth]}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                        />
                      </FormGroup>
                      <Hr />
                    </div>
                  )}

                  {!(
                    defaultValue.vehicles[key]?.odometerReading &&
                    defaultValue.vehicles[key]?.readingDate
                  ) && (
                    <div css={[utils.mt(3), styles.row]}>
                      <Text
                        bold
                        css={[utils.mr(5), utils.ml(2), utils.width("200px")]}
                      >
                        {info.model}
                      </Text>
                      <FormGroup
                        label={messages.Common.OdometerReading}
                        css={[styles.formGroup, utils.mx(2)]}
                      >
                        <FormikSpinner
                          name={`info.vehicles.${key}.odometerReading`}
                          step={500}
                          css={[utils.mb(3), utils.fullWidth]}
                          min={0}
                          onChange={(e) => {
                            formik.handleChange({
                              target: {
                                name: `info.vehicles.${key}.odometerReading`,
                                value: e,
                              },
                            });
                          }}
                        />
                      </FormGroup>
                      <FormGroup
                        label={messages.RequiredInformation.ReadingDate}
                        css={[styles.formGroup, utils.mx(2)]}
                      >
                        <FormikDatePicker
                          name={`info.vehicles.${key}.readingDate`}
                          css={[utils.mb(3), utils.fullWidth]}
                          onChange={(e) => {
                            formik.handleChange({
                              target: {
                                name: `info.vehicles.${key}.readingDate`,
                                value: e,
                              },
                            });
                          }}
                        />
                      </FormGroup>
                      <Hr />
                    </div>
                  )}
                </div>
              )
          )}
          {formik.values.info.drivers.map(
            (info, key) =>
              info.status === "Active" &&
              (!defaultValue.drivers[key].licenseNumber ||
                defaultValue.drivers[key].licenseNumber === "") && (
                <div key={key}>
                  <div
                    css={[
                      utils.display("flex"),
                      utils.alignItems("center"),
                      styles.row,
                    ]}
                  >
                    <Text
                      bold
                      css={[utils.mr(5), utils.ml(2), utils.width("200px")]}
                    >
                      {info.firstName}
                    </Text>
                    <FormGroup
                      label={messages.DriverModal.LicenseNumber}
                      css={styles.formGroup}
                    >
                      <FormikInput
                        name={`info.drivers.${key}.licenseNumber`}
                        css={[utils.mb(3), utils.mx(2), utils.fullWidth]}
                        onChange={(e) => {
                          formik.handleChange(e);
                        }}
                      />
                    </FormGroup>
                    <Hr />
                  </div>
                </div>
              )
          )}
          <div
            css={[
              utils.centerAlign,
              utils.fullWidth,
              utils.position("relative"),
              utils.mt(4),
            ]}
          >
            <Button
              type="button"
              buttonType="secondary"
              css={utils.mr(5)}
              onClick={onCloseModal}
            >
              {messages.Common.Cancel}
            </Button>
            <Button>{messages.Common.Save}</Button>
          </div>
        </form>
      </FormikProvider>
    </Modal>
  );
};
