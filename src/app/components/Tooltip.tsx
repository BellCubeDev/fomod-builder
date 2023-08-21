import RCTooltip from 'rc-tooltip';
import { T } from '@/app/components/localization';
import React from 'react';

import styles from './Tooltip.module.scss';

// https://www.npmjs.com/package/rc-tooltip

enum TooltipPlacement {
    // 'left','right','top','bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'rightTop', 'rightBottom', 'leftTop', 'leftBottom'
    Left = 'left',
    Right = 'right',
    Top = 'top',
    Bottom = 'bottom',
    TopLeft = 'topLeft',
    TopRight = 'topRight',
    BottomLeft = 'bottomLeft',
    BottomRight = 'bottomRight',
    RightTop = 'rightTop',
    RightBottom = 'rightBottom',
    LeftTop = 'leftTop',
    LeftBottom = 'leftBottom',
}

export default function Tooltip({position, children, ...props}: {position: TooltipPlacement, children: React.ReactNode} & ({overlay: React.ReactNode} | Parameters<typeof T>[0])) {
    return <RCTooltip
        overlayClassName={styles.tooltip}
        overlay={'overlay' in props ? props.overlay : <T {...props} />}
        trigger={['hover', 'focus']}
        mouseEnterDelay={0.3}
        mouseLeaveDelay={0.1}
        placement={position}
        showArrow={true}
    >
        <>{children}</>
    </RCTooltip>;
}
