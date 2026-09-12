"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

export type HaloReelItem = {
  src?: string;
  alt?: string;
  bgColor?: string;
  textColor?: string;
  title?: string;
  subtitle?: string;
  /** Custom overlay content rendered on top of the card */
  overlay?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
};

export interface HaloReelProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  items: HaloReelItem[];
  cardWidth?: number;
  cardHeight?: number;
  minScale?: number;
  radiusXRatio?: number;
  centerXRatio?: number;
  radiusYRatio?: number;
  /** autoPlay off by default — drag only */
  autoPlay?: boolean;
  holdDuration?: number;
  stepDuration?: number;
  pauseOnHover?: boolean;
  draggable?: boolean;
  spread?: number;
  maxCards?: number;
  dragSensitivity?: number;
  centerLabel?: React.ReactNode;
  showCenterLabel?: boolean;
  /** Fires with the index of the card currently snapped to center */
  onActiveChange?: (index: number) => void;
  /** Expose spinBy so parent can trigger prev/next */
  spinByRef?: React.MutableRefObject<((dir: number) => void) | null>;
}

const TAU = Math.PI * 2;
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export function HaloReel({
  items,
  cardWidth = 220,
  cardHeight = 300,
  minScale = 0.45,
  radiusXRatio = 0.42,
  centerXRatio = 0,
  radiusYRatio = 0.32,
  autoPlay = false,
  holdDuration = 1200,
  stepDuration = 600,
  pauseOnHover = true,
  draggable = true,
  spread = 1.3,
  maxCards = 64,
  dragSensitivity = 1,
  centerLabel,
  showCenterLabel = true,
  onActiveChange,
  spinByRef,
  className,
  style,
  ...props
}: HaloReelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const count = items.length;
  const rotation = useMotionValue(0);
  const draggingRef = React.useRef(false);
  const didDragRef = React.useRef(false);
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  const hoverRef = React.useRef(false);
  const onActiveChangeRef = React.useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;
  const [size, setSize] = React.useState({ w: 0, h: 0 });

  React.useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const measure = () => setSize({ w: node.offsetWidth, h: node.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const radiusX = size.w * radiusXRatio;
  const radiusY = size.h * radiusYRatio;

  const slots = clamp(
    Math.ceil(
      TAU * Math.max(
        radiusX / (cardWidth * spread),
        radiusY / (cardHeight * spread),
      ),
    ),
    count,
    Math.max(count, maxCards),
  );
  const step = slots ? TAU / slots : 0;

  const fit = size.w
    ? clamp(
        size.w / (radiusX + cardWidth),
        0.45,
        1,
      )
    : 1;

  const cardW = cardWidth * fit;
  const cardH = cardHeight * fit;

  // Autoplay (off by default)
  React.useEffect(() => {
    if (!autoPlay || reduceMotion || !count) return;
    let timer = 0;
    let controls: ReturnType<typeof animate> | undefined;
    const tick = () => {
      timer = window.setTimeout(() => {
        if (draggingRef.current || (pauseOnHover && hoverRef.current)) {
          tick();
          return;
        }
        controls = animate(rotation, rotation.get() - step, {
          duration: stepDuration / 1000,
          ease: [0.4, 0, 0.2, 1],
          onComplete: tick,
        });
      }, holdDuration);
    };
    tick();
    return () => {
      window.clearTimeout(timer);
      controls?.stop();
    };
  }, [autoPlay, count, holdDuration, pauseOnHover, reduceMotion, rotation, step, stepDuration]);

  // Drag
  const dragRef = React.useRef({ left: 0, top: 0, angle: 0 });

  const pointerAngle = (e: React.PointerEvent) => {
    const { left, top } = dragRef.current;
    return Math.atan2(
      (e.clientY - top - size.h / 2) / (radiusY || 1),
      (e.clientX - left - size.w * centerXRatio) / (radiusX || 1),
    );
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || (e.pointerType === "mouse" && e.button !== 0)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = { left: rect.left, top: rect.top, angle: 0 };
    dragRef.current.angle = pointerAngle(e);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    draggingRef.current = true;
    didDragRef.current = false;
    // Do NOT setPointerCapture here — that blocks click events on child cards
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    // Mark as real drag if pointer moved more than 6px from start
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > 6) didDragRef.current = true;
    const angle = pointerAngle(e);
    const delta = ((angle - dragRef.current.angle + Math.PI * 3) % TAU) - Math.PI;
    dragRef.current.angle = angle;
    rotation.set(rotation.get() + delta * dragSensitivity);
  };

  const notifyActive = React.useCallback((snappedRot: number) => {
    if (!onActiveChangeRef.current || !slots) return;
    // Which slot is at angle 0 (cos=1, front-most)?
    // slot i is at angle i*step + rotation → front when i*step + rotation = 0 (mod TAU)
    // → slot = round(-rotation / step) mod slots
    const slotIndex = ((Math.round(-snappedRot / step) % slots) + slots) % slots;
    const itemIndex = slotIndex % count;
    onActiveChangeRef.current(itemIndex);
  }, [slots, step, count]);

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const snapped = Math.round(rotation.get() / step) * step;
    if (reduceMotion) {
      rotation.set(snapped);
      notifyActive(snapped);
      setTimeout(() => { didDragRef.current = false; }, 50);
      return;
    }
    animate(rotation, snapped, {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => {
        didDragRef.current = false;
        notifyActive(snapped);
      },
    });
  };

  const spinBy = (direction: number) => {
    const target = Math.round(rotation.get() / step) * step - direction * step;
    if (reduceMotion) { rotation.set(target); notifyActive(target); return; }
    animate(rotation, target, {
      duration: stepDuration / 1000,
      ease: [0.4, 0, 0.2, 1],
      onComplete: () => notifyActive(target),
    });
  };

  // Expose spinBy to parent via ref so external buttons can navigate
  React.useEffect(() => {
    if (spinByRef) spinByRef.current = spinBy;
    return () => { if (spinByRef) spinByRef.current = null; };
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const direction = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key];
    if (!direction) return;
    e.preventDefault();
    spinBy(direction);
  };

  if (!count) return null;

  return (
    <div
      ref={stageRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={props["aria-label"] ?? "Work carousel"}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={[
        "relative w-full touch-pan-y select-none overflow-hidden outline-none",
        draggable ? "cursor-grab active:cursor-grabbing" : "",
        className ?? "",
      ].join(" ")}
      style={{ isolation: 'isolate' }}
      {...props}
    >
      {/* Center label */}
      {showCenterLabel && centerLabel ? (
        <div
          className="pointer-events-none absolute inset-y-0 z-0 flex items-center justify-center px-4 text-center"
          style={{ left: size.w * centerXRatio + radiusX + cardW / 2, right: 0 }}
        >
          {centerLabel}
        </div>
      ) : null}

      {Array.from({ length: slots }, (_, i) => (
        <WheelCard
          key={i}
          item={items[i % count]}
          decorative={i >= count}
          index={i}
          step={step}
          rotation={rotation}
          radiusX={radiusX}
          radiusY={radiusY}
          centerXRatio={centerXRatio}
          minScale={minScale}
          width={cardW}
          height={cardH}
          didDragRef={didDragRef}
          onHoverChange={(hovered) => { hoverRef.current = hovered; }}
        />
      ))}
    </div>
  );
}

function WheelCard({
  item,
  index,
  step,
  rotation,
  radiusX,
  radiusY,
  centerXRatio,
  minScale,
  width,
  height,
  decorative,
  didDragRef,
  onHoverChange,
}: {
  item: HaloReelItem;
  index: number;
  step: number;
  rotation: MotionValue<number>;
  radiusX: number;
  radiusY: number;
  centerXRatio: number;
  minScale: number;
  width: number;
  height: number;
  decorative: boolean;
  didDragRef: React.MutableRefObject<boolean>;
  onHoverChange: (hovered: boolean) => void;
}) {
  const cos = useTransform(rotation, (r) => Math.cos(index * step + r));
  const sin = useTransform(rotation, (r) => Math.sin(index * step + r));
  const x = useTransform(cos, (c) => c * radiusX);
  const y = useTransform(sin, (s) => s * radiusY);
  const scale = useTransform(cos, (c) => minScale + (1 - minScale) * ((c + 1) / 2));
  const zIndex = useTransform(scale, (s) => Math.round(s * 1000));

  const handleClick = () => {
    // Suppress click if user was dragging
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    item.onClick?.();
  };

  return (
    <motion.div
      role={decorative ? undefined : "group"}
      aria-roledescription={decorative ? undefined : "slide"}
      aria-hidden={decorative || undefined}
      onPointerEnter={() => onHoverChange(true)}
      onPointerLeave={() => onHoverChange(false)}
      onClick={handleClick}
      style={{
        x, y, scale, zIndex,
        width, height,
        left: `${centerXRatio * 100}%`,
        top: "50%",
        marginLeft: -width / 2,
        marginTop: -height / 2,
      }}
      className="absolute overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
    >
      {item.src ? (
        <>
          <img
            src={item.src}
            alt={decorative ? "" : (item.alt ?? "")}
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
            style={{ height: '58%', top: 0 }}
          />
          {item.overlay && (
            <div className="absolute inset-0 pointer-events-none">
              {item.overlay}
            </div>
          )}
        </>
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-1 p-3 text-center"
          style={{ backgroundColor: item.bgColor ?? "#111", color: item.textColor ?? "#fff" }}
        >
          {item.title && <span className="text-xl font-black leading-none">{item.title}</span>}
          {item.subtitle && <span className="text-[0.6rem] uppercase tracking-[0.2em] opacity-70">{item.subtitle}</span>}
        </div>
      )}
    </motion.div>
  );
}

export default HaloReel;
