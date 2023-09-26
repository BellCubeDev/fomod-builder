'use client';

import Dropdown from '../../dropdown/index';
import { SortingOrder } from 'fomod';
import { useTranslate } from '../../localization/index';

const orders = Object.values(SortingOrder) as SortingOrder[];

// Move `Explicit` to the top of the list
const explicitIndex = orders.indexOf(SortingOrder.Explicit);
if (explicitIndex !== -1) {
    orders.splice(explicitIndex, 1);
    orders.unshift(SortingOrder.Explicit);
}

export default function SortingOrderDropdown(props: Omit<Parameters<typeof Dropdown<string>>[0], 'options'>) {
    return <Dropdown<string>
        options={   orders.map(order => ({
            value: order,
                   // eslint-disable-next-line react-hooks/rules-of-hooks -- This will always be called in the same order
            label: useTranslate(`sorting_order_${order.toLowerCase() as Lowercase<SortingOrder>}`),
        }))   }
        {...props}
    />;
}
