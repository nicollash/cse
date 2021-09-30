
import { jsx, css } from '@emotion/react'
import { FunctionComponent, ChangeEvent } from 'react'
import { mediaBreakpointDown } from 'react-grid'
import { FormikValues } from 'formik'

import { Text, FormikSelect, FormikCheckbox } from '~/frontend/components'
import { CarCoverageInfo } from '~/types'
import { CarCoverageOptions } from '~/options'
import { useLocale } from '~/frontend/hooks'

interface Props {
  value: CarCoverageInfo
  namePrefix: string
  onChange: (e: Partial<ChangeEvent<any>>) => any
  alwaysShowLabel?: boolean
  formik?: FormikValues
}

interface FieldProps {
  component: 'select' | 'checkbox'
  labelField: string
  fieldName: string
  options?: any[]
}

const fields: FieldProps[] = [
  {
    component: 'select',
    labelField: 'Comprehensive',
    fieldName: 'comprehensive',
    options: CarCoverageOptions.Comprehensive,
  },
  {
    component: 'select',
    labelField: 'CollisionDeductible',
    fieldName: 'collisionDeductible',
    options: CarCoverageOptions.CollisionDeductible,
  },
  {
    component: 'select',
    labelField: 'DailyRentalCarLimit',
    fieldName: 'dailyRentalCarLimit',
    options: CarCoverageOptions.DailyRentalCarLimit,
  },
  {
    component: 'select',
    labelField: 'MedicalPartsAndAccessibility',
    fieldName: 'medicalPartsAndAccessibility',
    options: CarCoverageOptions.MedicalPartsAndAccessibility,
  },
  {
    component: 'checkbox',
    labelField: 'RoadsideAssistance',
    fieldName: 'roadsideAssistance',
  },
  {
    component: 'checkbox',
    labelField: 'FullGlass',
    fieldName: 'fullGlass',
  },
  {
    component: 'checkbox',
    labelField: 'LoanLeaseGap',
    fieldName: 'loanLeaseGap',
  },
  {
    component: 'checkbox',
    labelField: 'OriginalReplacementCost',
    fieldName: 'originalReplacementCost',
  },
  {
    component: 'checkbox',
    labelField: 'WaiveLiability',
    fieldName: 'waiveLiability',
  },
]

export const CarCoverage: FunctionComponent<Props> = ({
  value,
  namePrefix,
  onChange,
  alwaysShowLabel = false,
  formik,
}) => (
  <div css={styles.form}>
    {value.model && (
      <div css={styles.header}>
        <Text
          css={[styles.formLabel, alwaysShowLabel && styles.forceShow]}
          bold
          textAlign="center"
        >
          {value.model}
        </Text>
      </div>
    )}

    {fields.map((field) => (
      <Field
        value={value}
        namePrefix={namePrefix}
        onChange={onChange}
        alwaysShowLabel={alwaysShowLabel}
        formik={formik}
        field={field}
        key={field.fieldName}
      />
    ))}
  </div>
)

const Field: FunctionComponent<Props & {
  field: FieldProps
}> = ({ alwaysShowLabel, namePrefix, formik, onChange, field }) => {
  const { messages } = useLocale()

  return (
    <div css={field.component === 'select' ? styles.formGroup : styles.checkboxFormGroup}>
      <Text css={[styles.formLabel, alwaysShowLabel && styles.forceShow]}>
        {messages.Coverage[field.labelField]}
      </Text>

      {field.component === 'select' ? (
        <FormikSelect
          name={`${namePrefix}.${field.fieldName}`}
          css={styles.formControl}
          options={
            formik?.values.applyToAll &&
            formik?.initialValues.coverageInfo[field.fieldName] === ''
              ? [{ value: '', label: '' }, ...(field.options || [])]
              : field.options || []
          }
          onChange={(e) => {
            onChange({
              target: {
                name: `${namePrefix}.${field.fieldName}`,
                value: e.value,
              },
            })
          }}
        />
      ) : (
        <FormikCheckbox
          isNullable={
            formik?.values.applyToAll &&
            formik?.initialValues.coverageInfo[field.fieldName] === null
          }
          name={`${namePrefix}.${field.fieldName}`}
          css={styles.formControl}
          onChange={(e) => {
            onChange({
              target: {
                name: `${namePrefix}.${field.fieldName}`,
                value: e,
              },
            })
          }}
        />
      )}

      {formik?.values.applyToAll &&
        formik?.initialValues.coverageInfo[field.fieldName] === '' && (
          <Text css={styles.uniqueText} color="black">
            {messages.Common.UniqueSettingApplied}
          </Text>
        )}
    </div>
  )
}

const styles = {
  form: css``,

  header: css`
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  formGroup: css`
    position: relative;
    display: flex;

    & > span:first-of-type {
      display: none;
    }

    ${mediaBreakpointDown('md')} {
      flex-direction: column;
      & > span:first-of-type {
        display: inline-flex;
      }
    }
  `,

  checkboxFormGroup: css`
    position: relative;
    display: flex;

    & > span:first-of-type {
      display: none;
    }

    ${mediaBreakpointDown('md')} {
      flex-direction: column;
      & > span:first-of-type {
        display: inline-flex;
      }
      & > * {
        flex: 1;
      }
    }
  `,

  formLabel: css`
    margin: 1em;
  `,

  forceShow: css`
    display: inline-flex !important;
    min-width: 250px;
  `,

  formControl: css`
    flex: 1;
    margin: 0.5em 1em;
  `,

  uniqueText: css`
    position: absolute;
    padding: 0 1em;
    right: 0;
    display: flex;
    align-items: center;
    height: 100%;
    transform: translate(100%, 0);

    ${mediaBreakpointDown('md')} {
      position: relative;
      transform: initial;
      justify-content: flex-end;
    }
  `,
}
