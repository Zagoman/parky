import { faqs } from "./faq";
import styles from "./Accordion.module.scss";
import { useState } from "react";
import { AccordionItem } from "./components/AccordionItem";

export const Accordion = () => {
  const [selected, setSelected] = useState<string | number>("0");
  const selectionHandler = (index: number) => {
    if (selected === index) {
      return setSelected("0");
    }
    setSelected(index);
  };

  return (
    <div className={styles.accordion}>
      <section className={styles.accordionHeader}>
        <h3>FAQ</h3>
      </section>
      <ul className={styles.accordionQuestionWrapper}>
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            faq={faq}
            onClick={() => {
              selectionHandler(index);
            }}
            active={selected === index}
          />
        ))}
      </ul>
    </div>
  );
};
