import styled from "@emotion/styled";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";

import { utils, theme } from "~/frontend/styles";
import { config } from "~/config";
import { TAddressObject, EAddressObjectStatus } from "~/types";
import { useAddressDebounce } from "~/frontend/hooks";
import { loadScript, placeAPI } from "~/frontend/utils";

import { handleScriptLoad } from "./helpers";
import { Text } from "..";

export interface AddressInputProps {
  name?: string;
  width?: string;
  hasError?: boolean;
  className?: string;
  value?: TAddressObject;
  helperText?: string;
  placeholder?: string;

  onChange: (address: TAddressObject, selectedFromList: boolean) => any;
  onClearAddress?: (e: any) => any;
}

const AddressInputWrapper = styled.div<{ width?: string; hasError?: boolean }>`
  display: inline-block;
  width: ${({ width }) => (width ? width : "auto")};

  margin: 0;
  padding: 0;
  position: relative;

  color: ${({ hasError }) =>
    hasError ? theme.color.error : theme.color.default};
`;

const UnitNumber = styled.input<{ hasError?: boolean }>`
  margin: 0;
  padding: 1em 0.5em;

  border: none;
  overflow: hidden;
  text-overflow: ellipsis;

  position: absolute;
  right: 2em;
  top: 1px;
  width: 4em;

  &:active,
  &:focus {
    outline: none;
  }
  color: ${({ hasError }) =>
    hasError ? theme.color.error : theme.color.default};
`;

const AddressInputControl = styled.input<{
  hasError?: boolean;
  needUnitNumber?: boolean;
}>`
  line-height: 1.15;

  width: 100%;
  height: auto;

  margin: 0;
  padding: 1em ${({ needUnitNumber }) => (needUnitNumber ? "6em" : "2em")} 1em
    1em;

  text-overflow: ellipsis;
  overflow: hidden;

  border: 1px solid
    ${({ hasError }) => (hasError ? theme.errorBorderColor : theme.borderColor)};
  box-shadow: 5px 5px 10px ${theme.boxShadowColor};
  border-radius: 5px;
  background-color: white;

  &:active,
  &:focus {
    outline: none;
  }
`;

const ActionButton = styled.button`
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid ${theme.borderColor};
  padding: 0;
  font-size: 1em;
  line-height: 1em;
  right: 0.5em;
  top: 1em;

  &:active,
  &:focus {
    outline: none;
  }
`;

const LoadingWrapper = styled.div`
  position: absolute;
  width: 22px;
  height: 16px;
  right: 0.5em;
  top: 1em;
`;

export const AddressInput: FunctionComponent<AddressInputProps> = ({
  name,
  className,
  helperText,
  width,
  value,
  hasError,
  placeholder,
  onChange,
  onClearAddress,
  ...props
}) => {
  const autoCompleteRef = useRef(null);
  const [innerValue, setInnerValue] = useState<TAddressObject | undefined>(value);
  const [isImmediate, setImmediate] = useState<boolean | null>(null);
  const debouncedAddress = useAddressDebounce(
    innerValue!.address,
    innerValue!.unitNumber,
    isImmediate,
    3000
  );
  const [isChecking, setChecking] = useState(false);

  useEffect(() => {
    if (
      value!.address !== innerValue!.address ||
      value!.unitNumber !== innerValue!.unitNumber
    ) {
      setInnerValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (
      debouncedAddress.address === value!.address &&
      debouncedAddress.unitNumber === value!.address
    ) {
      return;
    }

    setChecking(true);
    placeAPI
      .checkAddress(debouncedAddress.address, debouncedAddress.unitNumber)
      .then(() => {
        onChange(
          {
            address: debouncedAddress.address,
            unitNumber: debouncedAddress.unitNumber,
            status: EAddressObjectStatus.success,
            requiredUnitNumber: !!debouncedAddress.unitNumber,
          },
          debouncedAddress.isImmediate
        );
      })
      .catch((e) => {
        onChange(
          {
            address: debouncedAddress.address,
            unitNumber: debouncedAddress.unitNumber,
            status: e,
            requiredUnitNumber:
              e === EAddressObjectStatus.unitNumberRequired ||
              e === EAddressObjectStatus.invalidUnitNumber ||
              !!debouncedAddress.unitNumber,
          },
          debouncedAddress.isImmediate
        );
      })
      .finally(() => setChecking(false));
  }, [debouncedAddress]);

  useEffect(() => {
    loadScript(
      "mapScriptLoader",
      `https://maps.googleapis.com//maps/api/js?key=${config.googleAPIKey}&libraries=places`,
      () =>
        handleScriptLoad((e: any) => {
          setInnerValue({
            ...value,
            address: e,
            unitNumber: "",
            status: EAddressObjectStatus.success,
          });
          setImmediate((v) => !v);
        }, autoCompleteRef)
    );
  }, []);

  return (
    <AddressInputWrapper
      width={width}
      hasError={hasError}
      className={className}
      {...props}
    >
      <AddressInputControl
        name={name}
        ref={autoCompleteRef}
        placeholder={placeholder}
        disabled={isChecking}
        value={innerValue!.address || ""}
        hasError={hasError}
        needUnitNumber={value!.requiredUnitNumber}
        data-testid="address-input"
        onKeyDown={(e) => {
          // enter key
          if (e.keyCode === 13) {
            e.preventDefault();
          }
        }}
        onChange={(e) =>
          setInnerValue({
            ...innerValue!,
            address: e.target.value,
            status: EAddressObjectStatus.success,
          })
        }
      />

      {value!.requiredUnitNumber && (
        <UnitNumber
          placeholder="Unit #"
          disabled={isChecking}
          value={innerValue!.unitNumber || ""}
          data-testid="unitnumber-input"
          onChange={(e) =>
            setInnerValue({
              ...innerValue!,
              unitNumber: e.target.value,
              status: EAddressObjectStatus.success,
            })
          }
        />
      )}
      {!!helperText && (
        <Text
          css={utils.pt(1)}
          size="0.8em"
          color={hasError ? theme.color.error : theme.color.default}
        >
          {helperText}
        </Text>
      )}
      {isChecking && (
        <LoadingWrapper>
          <BeatLoader size={3} />
        </LoadingWrapper>
      )}
      {!isChecking && value!.address && (
        <ActionButton onClick={onClearAddress} data-testid="clear-button">
          &times;
        </ActionButton>
      )}
    </AddressInputWrapper>
  );
};
