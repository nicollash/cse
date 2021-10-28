import { FunctionComponent, useMemo, useState } from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";

import {
  Modal,
  FormGroup,
  FormikInput,
  FormikSelect,
  Button,
  Hr,
  Text,
} from "~/frontend/components";
import { utils } from "~/frontend/styles";
import {
  AddVehicleByData,
  AddVehicleByVIN,
  VehicleInfo,
  DTORisk,
  QuoteDetail,
} from "~/types";

import { EditVehicleModal } from "../edit-vehicle";

import { styles } from "./styles";
import { useYearList, useMakeList, useModelList } from "./hooks";
import { useLocale } from "~/frontend/hooks";
import { getUpdatedRisk, parseRisk } from "~/helpers";
import { formRedirect } from "~/frontend/utils";
import { useRouter } from "next/router";

interface Props {
  quoteDetail: QuoteDetail;
  newRisk?: DTORisk;
  isOpen: boolean;
  onCloseModal?: () => any;
  onAddVehicle?: (risk: DTORisk) => any;
}

export const AddVehicleModal: FunctionComponent<Props> = ({
  isOpen,
  quoteDetail,
  newRisk: defaultNewRisk,
  onCloseModal,
  onAddVehicle,
}) => {
  const router = useRouter();
  const quoteNumber = router.query.quoteNumber as string;

  const { locale, messages } = useLocale();
  const [newRisk, setNewRisk] = useState<DTORisk>(defaultNewRisk);
  const [editCarVisible, setEditCarVisible] = useState(!!defaultNewRisk);

  const schemaByVin = useMemo(
    () =>
      Yup.object().shape({
        vinNumber: Yup.string()
          .label(messages.CarModal.CarVinNumber)
          .required(messages.CarModal.Errors.RequiredVinNumber)
          .max(17, messages.CarModal.Errors.VinNumberMaxLimitExceed),
      }),
    [locale]
  );

  const formikByVin = useFormik<AddVehicleByVIN>({
    validationSchema: schemaByVin,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: false,
    initialValues: {
      vinNumber: "",
    },
    onSubmit: (value) => {
      formRedirect("/action/quote/GetRiskByVIN", {
        form: JSON.stringify({
          vinNumber: value.vinNumber,
          redirectURL: `/quote/${quoteNumber}/customize`,
        }),
      });
    },
  });

  const schemaByData = useMemo(
    () =>
      Yup.object().shape({
        year: Yup.string()
          .label(messages.CarModal.ModelYear)
          .required(messages.CarModal.Errors.RequireModelYear),
        make: Yup.string()
          .label(messages.CarModal.Make)
          .required(messages.CarModal.Errors.RequireMake),
        model: Yup.string()
          .label(messages.CarModal.Model)
          .required(messages.CarModal.Errors.RequireModel),
      }),
    [locale]
  );

  const formikByData = useFormik<AddVehicleByData>({
    validationSchema: schemaByData,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: false,
    initialValues: {
      year: "",
      make: "",
      model: "",
    },
    onSubmit: (value) => {
      formRedirect("/action/quote/GetRiskByModelSystemID", {
        form: JSON.stringify({
          model: value.model,
          redirectURL: `/quote/${quoteNumber}/customize`,
        }),
      });
    },
  });

  const yearList = useYearList();
  const makeList = useMakeList(formikByData.values.year);
  const modelList = useModelList(
    formikByData.values.year,
    formikByData.values.make
  );

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      title={messages.CarModal.AddCar}
      onCloseModal={onCloseModal}
      width="1100px"
    >
      <FormikProvider value={formikByVin}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formikByVin.handleSubmit();
          }}
          css={styles.form}
        >
          <FormGroup label={messages.CarModal.CarVinNumber}>
            <FormikInput
              name="vinNumber"
              css={[utils.mb(3), styles.vinNumberInput]}
              onChange={(e) => {
                formikByVin.handleChange({
                  target: {
                    name: "vinNumber",
                    value: e.target.value.trim(),
                  },
                });
              }}
            />
          </FormGroup>
          <FormGroup css={styles.addCarBtn}>
            <Button type="submit" css={utils.fullWidth}>
              {messages.CarModal.AddCar}
            </Button>
          </FormGroup>
        </form>
      </FormikProvider>

      <div css={[utils.display("flex"), utils.alignItems("center")]}>
        <Hr css={utils.flex(1)} />
        <Text bold css={utils.mx("80px")}>
          {messages.CarModal.Or}
        </Text>
        <Hr css={utils.flex(1)} />
      </div>

      <FormikProvider value={formikByData}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formikByData.handleSubmit();
          }}
          css={styles.form}
        >
          <FormGroup
            label={messages.CarModal.ModelYear}
            css={styles.modelSelector}
          >
            <FormikSelect
              name="year"
              css={styles.selectInput}
              options={yearList.map((item) => ({
                label: item.toString(),
                value: item,
              }))}
              onChange={(e) => {
                formikByData.setFieldValue("make", "");
                formikByData.setFieldValue("model", "");
                formikByData.handleChange({
                  target: {
                    name: "year",
                    value: e.value,
                  },
                });
              }}
            />
          </FormGroup>
          <FormGroup label={messages.CarModal.Make} css={styles.modelSelector}>
            <FormikSelect
              name="make"
              css={styles.selectInput}
              options={makeList}
              noOptionsMessage={messages.Common.Errors.NoneAvailable}
              onChange={(e) => {
                formikByData.setFieldValue("model", "");
                formikByData.handleChange({
                  target: {
                    name: "make",
                    value: e.value,
                  },
                });
              }}
            />
          </FormGroup>
          <FormGroup label={messages.CarModal.Model} css={styles.modelSelector}>
            <FormikSelect
              name="model"
              css={styles.selectInput}
              options={modelList}
              noOptionsMessage={messages.Common.Errors.NoneAvailable}
              onChange={(e) => {
                formikByData.handleChange({
                  target: {
                    name: "model",
                    value: e.value,
                  },
                });
              }}
            />
          </FormGroup>
          <FormGroup>
            <Button type="submit" css={utils.fullWidth}>
              {messages.CarModal.AddCar}
            </Button>
          </FormGroup>
        </form>
      </FormikProvider>

      {newRisk && (
        <EditVehicleModal
          quoteDetail={quoteDetail}
          isOpen={editCarVisible}
          defaultValue={parseRisk(newRisk)}
          quoteNumber={quoteNumber}
          onCloseModal={() => {
            setEditCarVisible(false);
            onCloseModal();
          }}
          onUpdate={(vehicleInfo: VehicleInfo) => {
            onAddVehicle(getUpdatedRisk(newRisk, vehicleInfo));
          }}
        />
      )}
    </Modal>
  );
};
