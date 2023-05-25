/* eslint-disable @typescript-eslint/restrict-template-expressions */
// disabled because of multiple classes assigned in string literal
import React from "react";
import styles from "./AccordionItem.module.scss";

type Props = {
  faq: {
    question: string;
    answer: string;
  };
  onClick: () => void;
  active: boolean;
};

const arrowDown = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="#566777"
    viewBox="0 0 16 16"
    stroke="#566777"
    stroke-width="1"
  >
    <path
      fill-rule="evenodd"
      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
    />
  </svg>
);

const arrowUp = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="#566777"
    viewBox="0 0 16 16"
    stroke="#566777"
    stroke-width="1"
  >
    <path
      fill-rule="evenodd"
      d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
    />
  </svg>
);

export const AccordionItem = ({ faq, active, onClick }: Props) => {
  return (
    <li onClick={onClick} className={`${styles.accordionItem}`}>
      <div
        className={`${styles.accordionItemHeader} ${
          active ? styles.activeHeader : ""
        }`}
      >
        <h4>{faq.question}</h4>
        {active ? arrowUp : arrowDown}
      </div>
      <p
        className={`${styles.accordionItemContents} ${
          active ? styles.activeContents : ""
        }`}
      >
        {faq.answer}
      </p>
    </li>
  );
};
