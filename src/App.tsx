import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react'
import cookieImg from "./assets/cookie.png";
import sprinklesImage from "./assets/sprinkles.png";
import candyImage from "./assets/candy.png";
import zigzagImage from "./assets/zigzag.png";
;


// Define context type
type CookieContextType = {
    size: string
    setSize: (size: string) => void
    toppings: string[]
    toggleTopping: (t: string) => void
}


type ToppingConfig = {
  name: string;
  image: string;
  positions: {
    top?: string;
    bottom?: string;
    left?: string;
    transform?: string;
  }[];
  style?: React.CSSProperties;
};

type Position = {
    top?: string
    left?: string
    right?: string
    bottom?: string
    transform?: string
}

const POSITION_PRESETS = {
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    zigzagCenter: {
        top: '50%',
        left: '40%',
        transform: 'translate(-50%, -50%)',
    },
    topLeft: { top: '25%', left: '15%' },
    topRight: { top: '25%', right: '20%' },
    candyTopLeft: { top: '35%', left: '17%' },
    candyTopRight: { top: '10%', right: '35%' },
    bottomLeft: { bottom: '15%', left: '20%' },
    bottomRight: { bottom: '20%', right: '20%' },
    zigzagBottomLeft: { bottom: '30%', left: '25%' },
    zigzagBottomRight: { bottom: '30%', right: '25%' },
    midLeft: { top: '40%', left: '25%', transform: 'translateY(-50%)' },
    midRight: { top: '40%', right: '30%', transform: 'translateY(-50%)' },
    topCenter: { top: '10%', left: '35%', transform: 'translateX(-50%)' },
    zigzagTopCenter: { top: '22%', left: '50%', transform: 'translateX(-50%)' },
    bottomCenter: { bottom: '10%', left: '50%', transform: 'translateX(-50%)' },
} satisfies Record<string, Position & { transform?: string }>

// Create context with correct type (use null + type guard for safety)
const CookieContext = createContext<CookieContextType | null>(null)

// 🛠️ Hook to safely use context
const useCookie = () => {
    const ctx = useContext(CookieContext)
    if (!ctx)
        throw new Error('Cookie components must be used inside <CookieBuilder>')
    return ctx
}

// Main wrapper
function CookieBuilder ({ children }: { children: ReactNode }) {
    const [size, setSize] = useState('medium')
    const [toppings, setToppings] = useState<string[]>([])

    const toggleTopping = (toppin: string) =>
        setToppings((prev) =>
            prev.includes(toppin)
                ? prev.filter((x) => x !== toppin)
                : [...prev, toppin],
        )

    const value: CookieContextType = { size, setSize, toppings, toggleTopping }

    return (
        <CookieContext.Provider value={value}>
            <div className='cookie-builder-wrapper'>{children}</div>
        </CookieContext.Provider>
    )
}

// Compound component: SizeSelector
CookieBuilder.SizeSelector = function SizeSelector({
    options,
}: {
    options: string[]
}) {
    const { size, setSize } = useCookie()
    return (
      <div className="cookie-section">
        <h2>Select Size</h2>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setSize(option)}
            className={`size-button ${option === size ? "selected" : ""}`}
          >
            {option}
          </button>
        ))}
      </div>
    );
}

// Compound component: ToppingSelector
CookieBuilder.ToppingSelector = function ToppingSelector({
    options,
}: {
    options: string[]
}) {
    const { toppings, toggleTopping } = useCookie()
    return (
        <div className='cookie-section'>
            <h2>Select Toppings</h2>
            {options.map((option) => (
                <label key={option} className="topping-option">
                    <input
                        type="checkbox"
                        checked={toppings.includes(option)}
                        onChange={() => toggleTopping(option)}
                    />
                    {option}
                </label>
            ))}
        </div>
    )
}

// Compound component: Preview
CookieBuilder.Preview = function Preview() {
    const { size, toppings } = useCookie()
    const isSmall = size === 'small'
    const isLarge = size === 'large'
    const isMedium = size === 'medium'

    const renderWidth = () => {
        if (isSmall) {
            return 200
        }
        if (isMedium) {
            return 300
        }
        if (isLarge) {
            return 400
        }
    }

    const renderCookie = () => {
        const getCookieSize = () => {
            if (isSmall) return { width: 200 };
            if (isMedium) return { width: 300 };
            if (isLarge) return { width: 400, marginLeft: -17 };
            return null;
        };

        const sizeStyle = getCookieSize();

        if (!sizeStyle) return null;

        return (
            <img
                src={cookieImg}
                alt="Cookie"
                style={sizeStyle}
            />
        );
    };

    const TOPPING_CONFIGS: ToppingConfig[] = [
      {
        name: "candy",
        image: candyImage,
        positions: [
          POSITION_PRESETS.candyTopLeft,
          POSITION_PRESETS.candyTopRight,
          POSITION_PRESETS.bottomCenter,
        ],
        style: { width: 70 },
      },
      {
        name: "zigzag",
        image: zigzagImage,
        positions: [
          POSITION_PRESETS.zigzagTopCenter,
          POSITION_PRESETS.midLeft,
          POSITION_PRESETS.midRight,
          POSITION_PRESETS.zigzagBottomLeft,
          POSITION_PRESETS.zigzagBottomRight,
          POSITION_PRESETS.zigzagCenter,
        ],
        style: { width: 62, borderRadius: 11 },
      },
      {
        name: "sprinkles",
        image: sprinklesImage,
        positions: [
          POSITION_PRESETS.center,
          POSITION_PRESETS.topLeft,
          POSITION_PRESETS.topRight,
          POSITION_PRESETS.bottomLeft,
          POSITION_PRESETS.bottomRight,
          POSITION_PRESETS.topCenter,
        ],
        style: { width: 65, borderRadius: 10 },
      },
    ];

    const renderImages = (
        positions: Position[],
        style?: React.CSSProperties,
        image?: string,
        name?: string,
    ) => {
        return positions.map((pos, index) => (
            <div
                key={index}
                style={{
                    position: 'absolute',
                    ...pos,
                    ...(pos.transform ? { transform: pos.transform } : {}),
                }}
            >
                <img src={image} alt={name} style={style} />
            </div>
        ))
    }

    const renderToppings = () => {
        return TOPPING_CONFIGS.map(
            ({ name, image, positions, style }) =>
                toppings.includes(name) && (
                    <div key={name}>{renderImages(positions, style, image, name)}</div>
                ),
        )
    }

    return (
      <>
        <div className="cookie-preview-info">
          Cookie: {size} with {toppings.length ? toppings.join(', ') : 'no toppings'}
        </div>
          <div className="cookie-preview-container" style={{ width: renderWidth() }}>
            {renderCookie()}
            {renderToppings()}
          </div>
      </>
    )
}

export default CookieBuilder


 

