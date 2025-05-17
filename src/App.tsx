import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react'
import cookieImg from "./assets/cookie.png";
import darkChocolateChipsImage from "./assets/dark_chocolate_chips.png";
;


// Define context type
type PizzaContextType = {
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
    mushroomCenter: {
        top: '50%',
        left: '40%',
        transform: 'translate(-50%, -50%)',
    },
    topLeft: { top: '25%', left: '15%' },
    topRight: { top: '25%', right: '20%' },
    cheeseTopLeft: { top: '25%', left: '22%' },
    cheeseTopRight: { top: '25%', right: '25%' },
    bottomLeft: { bottom: '25%', left: '20%' },
    bottomRight: { bottom: '25%', right: '20%' },
    mushroomBottomLeft: { bottom: '30%', left: '25%' },
    mushroomBottomRight: { bottom: '30%', right: '25%' },
    midLeft: { top: '50%', left: '5%', transform: 'translateY(-50%)' },
    midRight: { top: '50%', right: '16%', transform: 'translateY(-50%)' },
    topCenter: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
    mushroomTopCenter: { top: '22%', left: '50%', transform: 'translateX(-50%)' },
    bottomCenter: { bottom: '10%', left: '50%', transform: 'translateX(-50%)' },
} satisfies Record<string, Position & { transform?: string }>

// Create context with correct type (use null + type guard for safety)
const PizzaContext = createContext<PizzaContextType | null>(null)

// 🛠️ Hook to safely use context
const usePizza = () => {
    const ctx = useContext(PizzaContext)
    if (!ctx)
        throw new Error('Pizza components must be used inside <PizzaBuilder>')
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

    const value: PizzaContextType = { size, setSize, toppings, toggleTopping }

    return (
        <PizzaContext.Provider value={value}>
            <div className="pizza-builder">{children}</div>
        </PizzaContext.Provider>
    )
}

// Compound component: SizeSelector
CookieBuilder.SizeSelector = function SizeSelector({
    options,
}: {
    options: string[]
}) {
    const { size, setSize } = usePizza()
    return (
        <div>
            <h2>Select Size</h2>
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => setSize(option)}
                    style={{ fontWeight: option === size ? 'bold' : 'normal' }}
                >
                    {option}
                </button>
            ))}
        </div>
    )
}

// Compound component: ToppingSelector
CookieBuilder.ToppingSelector = function ToppingSelector({
    options,
}: {
    options: string[]
}) {
    const { toppings, toggleTopping } = usePizza()
    return (
        <div>
            <h2>Select Toppings</h2>
            {options.map((option) => (
                <label key={option} style={{ display: 'block' }}>
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
    const { size, toppings } = usePizza()
    const isSmall = size === 'small'
    const isLarge = size === 'large'
    const isMedium = size === 'medium'

    const renderWidth = () => {
        if (isSmall) {
            return 150
        }
        if (isMedium) {
            return 250
        }
        if (isLarge) {
            return 350
        }
    }

    const renderPizza = () => {
        const getPizzaSize = () => {
            if (isSmall) return { width: 150 };
            if (isMedium) return { width: 250 };
            if (isLarge) return { width: 350, marginLeft: -17 };
            return null;
        };

        const sizeStyle = getPizzaSize();

        if (!sizeStyle) return null;

        return (
            <img
                src={cookieImg}
                alt="Pizza"
                style={sizeStyle}
            />
        );
    };

    const TOPPING_CONFIGS: ToppingConfig[] = [
      {
        name: "cheese",
        image: darkChocolateChipsImage,
        positions: [
          POSITION_PRESETS.cheeseTopLeft,
          POSITION_PRESETS.cheeseTopRight,
          POSITION_PRESETS.bottomCenter,
        ],
        style: { width: 20 },
      },
      {
        name: "mushrooms",
        image: darkChocolateChipsImage,
        positions: [
          POSITION_PRESETS.mushroomTopCenter,
          POSITION_PRESETS.midLeft,
          POSITION_PRESETS.midRight,
          POSITION_PRESETS.mushroomBottomLeft,
          POSITION_PRESETS.mushroomBottomRight,
          POSITION_PRESETS.mushroomCenter,
        ],
        style: { width: 22, borderRadius: 11 },
      },
      {
        name: "tomato",
        image: "/images/tomato.png",
        positions: [
          POSITION_PRESETS.center,
          POSITION_PRESETS.topLeft,
          POSITION_PRESETS.topRight,
          POSITION_PRESETS.bottomLeft,
          POSITION_PRESETS.bottomRight,
          POSITION_PRESETS.topCenter,
        ],
        style: { width: 30, borderRadius: 10 },
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
        <h3>
            Pizza: {size} with {toppings.length ? toppings.join(', ') : 'no toppings'}
            <div style={{ position: 'relative', width: renderWidth() }}>
                <div>
                    {renderPizza()}
                    {renderToppings()}
                </div>
            </div>
        </h3>
    )
}

export default CookieBuilder


 

