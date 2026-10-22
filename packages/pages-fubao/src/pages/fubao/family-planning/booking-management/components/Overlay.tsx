export enum OverlayType {
    IllegalMoveHover,
    LegalMoveHover,
    PossibleMove
}
import React from "react";
export const Overlay = ({ type }: { type: OverlayType }) => {
    const color = getOverlayColor(type);
    return (<div className="overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 1,
        opacity: 0.5,
        backgroundColor: color,
    }} />);
};
function getOverlayColor(type: OverlayType) {
    switch (type) {
        case OverlayType.IllegalMoveHover:
            return 'red';
        case OverlayType.LegalMoveHover:
            return 'green';
        case OverlayType.PossibleMove:
            // return 'yellow';
            return ''
    }
}
