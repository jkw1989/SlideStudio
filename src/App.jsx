import { useState, useEffect, useRef } from "react";
import { useLibraries } from "./hooks/useLibraries";
import {
    UploadIcon,
    RefreshCwIcon,
    ShuffleIcon,
    TrashIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    DownloadIcon,
} from "./components/Icons";
import { Btn, Input, Label, Section, Select, Slider } from "./components/UI";

function App() {
    const libsLoaded = useLibraries();

    // State
    const [photos, setPhotos] = useState([]);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [cols, setCols] = useState(4);
    const [gap, setGap] = useState(12);
    const [radius, setRadius] = useState(6);
    const [borderWeight, setBorderWeight] = useState(1);
    const [zoom, setZoom] = useState(130);
    const [rotation, setRotation] = useState(20);
    const [aspectRatio, setAspectRatio] = useState("16:9");
    const [borderColor, setBorderColor] = useState("#4442e3");
    const [bgColor, setBgColor] = useState("#ededed");
    const [isExporting, setIsExporting] = useState(false);
    const [colYOffset, setColYOffset] = useState(0);

    // Pan state
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    // Refs
    const gridRef = useRef(null);
    const masonryInstance = useRef(null);
    const captureAreaRef = useRef(null);
    const workspaceRef = useRef(null);

    const [previewScale, setPreviewScale] = useState(0.55);

    const BASE_WIDTH = 1000;
    const canvasWidth =
        aspectRatio === "16:9" ? 1280 : aspectRatio === "1:1" ? 1000 : 720;
    const canvasHeight =
        aspectRatio === "16:9" ? 720 : aspectRatio === "1:1" ? 1000 : 1280;

    const itemWidth = (BASE_WIDTH - gap * (cols - 1)) / cols;

    // Apply column y-offsets based on actual column positions
    const applyColumnOffsets = () => {
        if (!gridRef.current || !masonryInstance.current) return;

        const items = gridRef.current.querySelectorAll(".grid-item");
        const columnWidth = itemWidth + gap;

        // Use Masonry's layout data to determine column positions
        items.forEach((item) => {
            // Get the item's position from Masonry
            const masonryItem = masonryInstance.current.getItem(item);
            if (!masonryItem) return;

            // Calculate which column based on the item's x position
            const x = masonryItem.position.x;
            const colIndex = Math.round(x / columnWidth);

            // Offset only odd columns (1, 3, 5, ...), keep even columns (0, 2, 4, ...) fixed
            const offsetY = colIndex % 2 === 1 ? colYOffset : 0;
            item.style.transform = `translateY(${offsetY}px)`;
        });
    };

    // Initialize and Update Masonry
    useEffect(() => {
        if (libsLoaded && gridRef.current) {
            window.imagesLoaded(gridRef.current, () => {
                if (!masonryInstance.current) {
                    masonryInstance.current = new window.Masonry(
                        gridRef.current,
                        {
                            itemSelector: ".grid-item",
                            columnWidth: ".grid-item",
                            percentPosition: false,
                            transitionDuration: "0.4s",
                            gutter: gap,
                        },
                    );
                } else {
                    masonryInstance.current.options.gutter = gap;
                    masonryInstance.current.reloadItems();
                    masonryInstance.current.layout();
                }
                // Wait for masonry layout to complete before applying offsets
                setTimeout(() => {
                    applyColumnOffsets();
                }, 50);
            });
        }
    }, [libsLoaded, photos, gap, cols]);

    // Re-apply offsets when colYOffset changes
    useEffect(() => {
        applyColumnOffsets();
    }, [colYOffset]);

    // Handle Dragging
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            setPan({
                x: e.clientX - dragStart.current.x,
                y: e.clientY - dragStart.current.y,
            });
        };
        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    // Responsive preview scaling
    useEffect(() => {
        const updateScale = () => {
            if (workspaceRef.current) {
                const { clientWidth, clientHeight } = workspaceRef.current;
                const padding = 160;

                const scaleX = (clientWidth - padding) / canvasWidth;
                const scaleY = (clientHeight - padding) / canvasHeight;
                const newScale = Math.min(scaleX, scaleY);

                setPreviewScale(Math.min(newScale, 1.2));
            }
        };

        if (libsLoaded) {
            setTimeout(updateScale, 50);
        }

        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, [libsLoaded, canvasWidth, canvasHeight]);

    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map((file) => ({
            id: Math.random().toString(36).substring(2, 9) + "-" + Date.now(),
            src: URL.createObjectURL(file),
        }));
        setPhotos((prev) => [...prev, ...newPhotos]);
        e.target.value = null;
    };

    const handleShuffle = () => {
        setPhotos((prev) => {
            const shuffled = [...prev];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        });
    };

    const handleDelete = (index) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleMove = (index, direction) => {
        setPhotos((prev) => {
            const nextPhotos = [...prev];
            const targetIndex = index + direction;
            if (targetIndex >= 0 && targetIndex < nextPhotos.length) {
                [nextPhotos[index], nextPhotos[targetIndex]] = [
                    nextPhotos[targetIndex],
                    nextPhotos[index],
                ];
            }
            return nextPhotos;
        });
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        setPhotos((prev) => {
            const updated = [...prev];
            const draggedItem = updated[draggedIndex];
            updated.splice(draggedIndex, 1);
            updated.splice(index, 0, draggedItem);
            return updated;
        });

        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleExport = async () => {
        if (!captureAreaRef.current || !window.html2canvas) return;
        setIsExporting(true);

        const parentElement = captureAreaRef.current.parentElement;
        const originalTransform = parentElement.style.transform;
        parentElement.style.transform = "scale(1)";

        await new Promise((resolve) => setTimeout(resolve, 50));

        try {
            const canvas = await window.html2canvas(captureAreaRef.current, {
                useCORS: true,
                scale: 3,
                backgroundColor: bgColor,
                width: canvasWidth,
                height: canvasHeight,
                onclone: (doc) => {
                    const mask = doc.getElementById("bleed-mask-node");
                    if (mask) mask.style.display = "none";
                },
            });

            const link = document.createElement("a");
            link.download = `slide-studio-export.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) {
            console.error("Export Error:", err);
        } finally {
            parentElement.style.transform = originalTransform;
            setIsExporting(false);
        }
    };

    const handleFill = () => {
        if (photos.length === 0) return;

        setPhotos((prev) => {
            const filled = [...prev];
            const originalLength = prev.length;

            // Add exactly 10 duplicates, cycling through original photos
            for (let i = 0; i < 10; i++) {
                const photoToDuplicate = prev[i % originalLength];
                filled.push({
                    id:
                        Math.random().toString(36).substring(2, 9) +
                        "-" +
                        Date.now() +
                        "-" +
                        i,
                    src: photoToDuplicate.src,
                });
            }

            return filled;
        });
    };

    if (!libsLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-bg text-ink font-display">
                <p className="text-lg font-bold">Loading components...</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex overflow-hidden font-sans bg-bg text-ink">
            {/* Workspace Area */}
            <main
                ref={workspaceRef}
                className="flex-grow flex items-center justify-center relative overflow-hidden bg-bg-2 border-r border-line"
            >
                <div
                    style={{
                        transform: `scale(${previewScale})`,
                        transformOrigin: "center",
                    }}
                >
                    <div
                        id="capture-area-node"
                        ref={captureAreaRef}
                        onMouseDown={(e) => {
                            if (e.button !== 0) return;
                            setIsDragging(true);
                            dragStart.current = {
                                x: e.clientX - pan.x,
                                y: e.clientY - pan.y,
                            };
                        }}
                        className="canvas-area"
                        style={{
                            backgroundColor: bgColor,
                            width: `${canvasWidth}px`,
                            height: `${canvasHeight}px`,
                            cursor: isDragging ? "grabbing" : "grab",
                        }}
                    >
                        <div
                            style={{
                                transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg)`,
                                display: "inline-block",
                            }}
                        >
                            <div
                                style={{
                                    transform: `scale(${zoom / 100})`,
                                    transformOrigin: "center center",
                                }}
                            >
                                <div
                                    ref={gridRef}
                                    className="grid"
                                    style={{ width: `${BASE_WIDTH}px` }}
                                >
                                    {photos.map((photo) => (
                                        <div
                                            key={photo.id}
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
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Viewport Guide */}
                        <div id="bleed-mask-node" className="bleed-mask"></div>
                    </div>
                </div>
            </main>

            {/* Sidebar */}
            <aside className="sidebar">
                <h1 className="text-[22px] font-extrabold uppercase tracking-tight font-display text-ink mb-0">
                    Slide Studio
                </h1>
                <p className="text-[12px] mb-6 leading-tight text-ink-mute font-normal">
                    Upload images to create custom masonry grids for your
                    presentation.
                </p>

                <Section title="1. Add files" subtitle="JPG / PNG">
                    <div className="flex gap-1 mb-1">
                        <Btn
                            variant="secondary"
                            onClick={() =>
                                document.getElementById("up").click()
                            }
                            className="flex-grow h-[36px] !py-0 bg-white"
                        >
                            <UploadIcon size={16} /> Choose files
                        </Btn>
                        {photos.length > 1 && (
                            <div className="tooltip">
                                <Btn
                                    variant="secondary"
                                    onClick={handleShuffle}
                                    className="w-[44px] h-[36px] !px-0 !py-0 shrink-0 bg-white flex items-center justify-center"
                                >
                                    <ShuffleIcon size={16} />
                                </Btn>
                                <span className="tooltip-text">
                                    Shuffle images
                                </span>
                            </div>
                        )}
                        {photos.length > 0 && (
                            <div className="tooltip">
                                <Btn
                                    variant="secondary"
                                    onClick={handleFill}
                                    className="w-[44px] h-[36px] !px-0 !py-0 shrink-0 bg-white text-xs flex items-center justify-center"
                                >
                                    +10
                                </Btn>
                                <span className="tooltip-text">
                                    Add 10 duplicates
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Thumbnail manager */}
                    {photos.length > 0 && (
                        <div className="thumbnail-manager">
                            <div className="grid grid-cols-5 gap-2 max-h-[108px] overflow-hidden p-0.5 pr-1.5">
                                {photos.map((photo, index) => (
                                    <div
                                        key={photo.id}
                                        draggable="true"
                                        onDragStart={(e) =>
                                            handleDragStart(e, index)
                                        }
                                        onDragOver={(e) =>
                                            handleDragOver(e, index)
                                        }
                                        onDragEnd={handleDragEnd}
                                        className="thumbnail-item"
                                        data-dragged={draggedIndex === index}
                                    >
                                        <img
                                            src={photo.src}
                                            alt=""
                                            className="w-full h-full object-cover pointer-events-none"
                                        />
                                        {/* Overlay Controls */}
                                        <div className="thumbnail-overlay">
                                            {/* Delete Button at top-right */}
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() =>
                                                        handleDelete(index)
                                                    }
                                                    className="thumbnail-btn delete-btn"
                                                    title="Delete image"
                                                >
                                                    <TrashIcon size={12} />
                                                </button>
                                            </div>

                                            {/* Reorder Buttons at bottom */}
                                            <div className="flex justify-between w-full">
                                                <button
                                                    onClick={() =>
                                                        handleMove(index, -1)
                                                    }
                                                    disabled={index === 0}
                                                    className="thumbnail-btn"
                                                    title="Move left"
                                                >
                                                    <ArrowLeftIcon size={12} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleMove(index, 1)
                                                    }
                                                    disabled={
                                                        index ===
                                                        photos.length - 1
                                                    }
                                                    className="thumbnail-btn"
                                                    title="Move right"
                                                >
                                                    <ArrowRightIcon size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <input
                        type="file"
                        id="up"
                        multiple
                        accept=".png, .jpg, .jpeg"
                        onChange={handleUpload}
                        className="hidden"
                    />
                </Section>

                <Section title="2. Grid layout">
                    <div className="grid grid-cols-2 gap-3 mb-2">
                        <div>
                            <Label>Columns</Label>
                            <Input
                                type="number"
                                value={cols}
                                onChange={(e) =>
                                    setCols(parseInt(e.target.value) || 1)
                                }
                            />
                        </div>
                        <div>
                            <Label>Gap (px)</Label>
                            <Input
                                type="number"
                                value={gap}
                                onChange={(e) =>
                                    setGap(parseInt(e.target.value) || 0)
                                }
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>Border radius</Label>
                            <Input
                                type="number"
                                value={radius}
                                onChange={(e) =>
                                    setRadius(parseInt(e.target.value) || 0)
                                }
                            />
                        </div>
                        <div>
                            <Label>Border weight</Label>
                            <Input
                                type="number"
                                value={borderWeight}
                                onChange={(e) =>
                                    setBorderWeight(
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                            />
                        </div>
                    </div>
                    <Slider
                        label="Offset %"
                        value={colYOffset}
                        min={-100}
                        max={100}
                        onChange={setColYOffset}
                        className="mt-3"
                    />
                </Section>

                <Section title="3. Adjust viewport">
                    <div className="mb-3">
                        <Label>Format</Label>
                        <Select
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                        >
                            <option value="16:9">Landscape (16:9)</option>
                            <option value="9:16">Portrait (9:16)</option>
                            <option value="1:1">Square (1:1)</option>
                        </Select>
                    </div>

                    <Slider
                        label="Zoom %"
                        value={zoom}
                        min={10}
                        max={400}
                        onChange={setZoom}
                    />

                    <Slider
                        label="Rotation °"
                        value={rotation}
                        min={-180}
                        max={180}
                        onChange={setRotation}
                    />
                </Section>

                {/* Appearance Section */}
                <Section
                    title="4. Appearance"
                    hasDivider={false}
                    className="mb-4"
                >
                    <div className="space-y-2">
                        <div className="color-control">
                            <Label className="!mb-0">Border color</Label>
                            <input
                                type="color"
                                value={borderColor}
                                onChange={(e) => setBorderColor(e.target.value)}
                                className="w-6 h-6 cursor-pointer border-none p-0 outline-none"
                            />
                        </div>
                        <div className="color-control">
                            <Label className="!mb-0">Canvas background</Label>
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="w-6 h-6 cursor-pointer border-none p-0 outline-none"
                            />
                        </div>
                    </div>
                </Section>

                {/* Action Area */}
                <div className="action-area">
                    <div className="flex justify-center items-center">
                        <Btn
                            variant="secondary"
                            onClick={handleExport}
                            disabled={isExporting || photos.length === 0}
                            className="h-[36px] !py-0 bg-white"
                            style={{ width: "291px" }}
                        >
                            <DownloadIcon size={16} />{" "}
                            {isExporting ? "Exporting..." : "Export Image"}
                        </Btn>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="reset-btn"
                    >
                        <RefreshCwIcon size={14} /> Clear settings
                    </button>
                </div>
            </aside>
        </div>
    );
}

export default App;
