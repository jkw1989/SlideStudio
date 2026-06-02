import React from "react";

const GridItem = React.memo(
    ({ photo, itemWidth, gap, radius, borderWeight, borderColor }) => {
        return (
            <div
                className="grid-item"
                style={{
                    width: `${itemWidth}px`,
                    marginBottom: `${gap}px`,
                }}
            >
                <div
                    className="bg-paper overflow-hidden"
                    style={{
                        borderRadius: `${radius}px`,
                        border: `${borderWeight}px solid ${borderColor}`,
                    }}
                >
                    <img
                        src={photo.src}
                        alt=""
                        className="w-full block pointer-events-none"
                        loading="lazy"
                    />
                </div>
            </div>
        );
    },
);

GridItem.displayName = "GridItem";

export default GridItem;
