/* eslint-disable no-nested-ternary */
import { FC } from 'react';
import Select, { ActionMeta, SingleValue, StylesConfig } from 'react-select';

export interface Option {
  value: number;
  label: string;
}

interface ComponentProps {
  options: Option[];
  placeholder: string;
  name: string;
  onSelectChange: (
    newValue: SingleValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => void;
  value: SingleValue<Option>;
}

const SelectComponent: FC<ComponentProps> = ({
  options,
  placeholder,
  name,
  onSelectChange,
  value,
}) => {
  const getSharedSelectProps = () => {
    return {
      name,
      options,
      placeholder,
      className: 'profile-skills-select',
    };
  };

  const customStyles: StylesConfig<Option> = {
    container: styles => ({
      ...styles,
      display: 'flex',
      justifyContent: 'center',
    }),
    control: styles => ({
      ...styles,
      backgroundColor: '#2d2d35',
      borderWidth: 1.2,
      borderColor: '#3c3c3c',
      borderRadius: 20,
      width: '80%',
      height: 55,
      margin: '0 auto',
      padding: '0 20px',
      cursor: 'pointer',
      ':hover': {
        ...styles[':hover'],
        borderColor: '#3c3c3c',
      },
      ':active': {
        ...styles[':active'],
        borderColor: '#3c3c3c',
      },
    }),
    menu: styles => ({
      ...styles,
      backgroundColor: '#2d2d35',
      width: '80%',
      borderColor: '#3c3c3c',
      overflow: 'auto',
      zIndex: 2,
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isSelected ? '#1d1d23' : '#2d2d35',
        color: 'white',
        cursor: isDisabled ? 'not-allowed' : 'default',
        width: '100%',

        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? 'white'
              : '#1d1d23'
            : undefined,
        },
        ':hover': {
          ...styles[':hover'],
          backgroundColor: '#3d3d47',
          cursor: 'pointer',
        },
      };
    },
    input: styles => ({ ...styles, backgroundColor: 'red', outline: 'none' }),
    placeholder: styles => ({
      ...styles,
      color: 'white',
      fontFamily: "'Roboto Flex', sans-serif",
      fontWeight: 500,
      fontSize: 18,
    }),
    singleValue: (styles, { data }) => ({ ...styles, color: 'white' }),
    indicatorSeparator: styles => ({ ...styles, display: 'none' }),
  };

  return (
    <Select
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...getSharedSelectProps()}
      maxMenuHeight={200}
      onChange={onSelectChange}
      value={value}
      isSearchable={false}
      styles={customStyles}
      isMulti={false}
    />
  );
};

export default SelectComponent;
