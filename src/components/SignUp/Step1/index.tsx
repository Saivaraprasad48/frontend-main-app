import { IChoice } from 'interfaces/auth';
import _ from 'lodash';
import { FC, useRef, useState } from 'react';
import { setItem } from 'utils/localStorageFn';
import ChoiceButton from '../ChoiceButton';
import styles from './index.module.scss';

interface IStep0 {
  setStep: React.Dispatch<React.SetStateAction<string | null>>;
}

const choicesArray = [
  { id: 0, value: 'Run Business Development with community' },
  { id: 1, value: 'Manage Projects with the community' },
  { id: 2, value: 'Use Neon Sundae Tools to build my product' },
  { id: 3, value: 'Easily Manage my online communities' },
  { id: 4, value: 'Post Jobs and Hire Superstars' },
  { id: 5, value: 'Host and Run Hackathons' },
];

const Step1: FC<IStep0> = ({ setStep }) => {
  const [selected, setSelected] = useState<any>([]);

  const elementRef: any = useRef();

  const handleClick = (choice: IChoice) => {
    const result = selected.find((obj: IChoice) => {
      console.log(obj.id === choice.id);
      return obj.id === choice.id;
    });

    if (result) {
      elementRef.current.children[1].children[choice.id].style.border =
        '0.7px solid #cf92ff';
      const filteredData = selected.filter(
        (elem: IChoice) => elem.id !== choice.id
      );
      setSelected(filteredData);
    } else {
      elementRef.current.children[1].children[choice.id].style.border =
        '2px solid #fff';
      const filteredData = [...selected, choice];
      setSelected(filteredData);
    }
  };

  const handleSubmit = () => {
    setItem('choices', JSON.stringify(selected));
    setStep('step2');
  };

  return (
    <>
      <div className={styles['step1-container']} ref={elementRef}>
        <p className={styles['step1-container--heading-text']}>
          What do you want to do on Neon Sundae?
        </p>
        <form
          className={styles['step1-container--form']}
          onSubmit={handleSubmit}
        >
          {choicesArray?.map((choice: IChoice) => (
            <ChoiceButton
              key={choice.id}
              width="380px"
              height="80px"
              selectObjective={handleClick}
              choice={choice}
              activeButton={false}
            />
          ))}

          <input
            className={styles['step1-container--form-submit-button']}
            type="submit"
            value="Next"
            disabled={!selected.length}
          />
        </form>
      </div>
    </>
  );
};

export default Step1;