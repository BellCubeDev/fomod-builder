import React from 'react';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DeleteButton({onActivation, ...props}: {onActivation: (React.MouseEventHandler<HTMLButtonElement>)} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'|`on${string}`>) {
    return <button {...props} type='button' onClick={onActivation}>
        <FontAwesomeIcon icon={faTrashCan} />
    </button>;
}
