import { useState } from 'react';
import styles from '../styles.module.scss';
import cls from 'classnames';
const data = [
    {
        title: 'Feugiat purus mi nisl dolor pellentesque tellus?',
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        title: 'Suspendisse nunc sagittis adipiscing imperdiet turpis sodales massa convallis sit?',
        content:
            'Sed felis eget velit aliquet sagittis id consectetur. Arcu non odio euismod lacinia at quis. Lectus nulla at volutpat diam ut venenatis tellus. Faucibus pulvinar elementum integer enim neque volutpat ac. Rhoncus dolor purus non enim praesent elementum facilisis. Integer enim neque volutpat ac tincidunt vitae semper. Volutpat consequat mauris nunc congue nisi vitae suscipit. Vitae suscipit tellus mauris a. Donec massa sapien faucibus et molestie ac feugiat sed. Id velit ut tortor pretium. Dui vivamus arcu felis bibendum. Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Massa tincidunt dui ut ornare. Hendrerit dolor magna eget est lorem ipsum dolor sit amet.'
    },
    {
        title: 'Facillisis adipiscing lacus, nisl at in consectetur in?',
        content:
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
        title: 'Feugiat purus mi nisl dolor pellentesque tellus?',
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        title: 'Suspendisse nunc sagittis adipiscing imperdiet turpis sodales massa convallis sit?',
        content:
            'Sed felis eget velit aliquet sagittis id consectetur. Arcu non odio euismod lacinia at quis. Lectus nulla at volutpat diam ut venenatis tellus. Faucibus pulvinar elementum integer enim neque volutpat ac. Rhoncus dolor purus non enim praesent elementum facilisis. Integer enim neque volutpat ac tincidunt vitae semper. Volutpat consequat mauris nunc congue nisi vitae suscipit. Vitae suscipit tellus mauris a. Donec massa sapien faucibus et molestie ac feugiat sed. Id velit ut tortor pretium. Dui vivamus arcu felis bibendum. Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Massa tincidunt dui ut ornare. Hendrerit dolor magna eget est lorem ipsum dolor sit amet.'
    },
    {
        title: 'Pellentesque egestas eget amet erat leo arcu?',
        content:
            'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
];
function Accordion() {
    const [openIndex, setOpenIndex] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);

    const handleItemClick = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const {
        accordion,
        accordionItem,
        accordionHeader,
        accordionHeaderHover,
        accordionIcon,
        accordionIconRotate,
        accordionContent,
        accordionContentOpen,
        TextAccordion
    } = styles;
    return (
        <div className={accordion}>
            {data.map((item, index) => (
                <div
                    key={index}
                    className={accordionItem}
                    onClick={() => handleItemClick(index)}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    <div
                        className={cls(accordionHeader, {
                            [accordionHeaderHover]: hoverIndex === index
                        })}
                    >
                        <div className={TextAccordion}>{item.title}</div>
                        <div
                            className={cls(accordionIcon, {
                                [accordionIconRotate]: openIndex === index
                            })}
                        >
                            +
                        </div>
                    </div>
                    <div
                        className={cls(accordionContent, {
                            [accordionContentOpen]: openIndex === index
                        })}
                    >
                        {item.content}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Accordion;
