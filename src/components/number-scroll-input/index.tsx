import React, { useEffect, useRef } from 'react';

interface Props {
    name: string,
    max: number,
    state: [number, React.Dispatch<React.SetStateAction<number>>]
}

enum ScrollDirection {
    up = "up",
    down = "down"
}

/*
 * Works by getting the number of pixels the user has scroll from the top.
 * The scroll input has child nodes of 80px each.
 * Rounding the quotient of scrollableInput.current.scroll by childNodesHeight gives us the numerical value to be used.
*/

export default function NumberScrollInput({ name, max, state }: Props) {

    // TO DO: IMPROVE SCROLL UX

    const [value, setValue] = state;
    const scrollableInputRef = useRef<HTMLDivElement | null>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    // height of each indivisual child in the scroll input.
    const childNodesHeight = 80;

    const handleScroll: React.UIEventHandler = (e) => {
        if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(onScrollEnd,100);
    }   

    function onScrollEnd() {
        let scrollInput = scrollableInputRef.current;
        if (scrollInput) {
            const scrollTop = scrollInput.scrollTop;
            const valueFromScroll = Math.round(scrollTop/childNodesHeight);
            setValue(valueFromScroll);
        }

    }

    useEffect(() => {
        if (scrollableInputRef.current) {
            scrollableInputRef.current.scrollTop = childNodesHeight * value;
        }
    }, [value]);

    return (
        <div className='flex w-24 space-y-2 flex-col'>
            <p className={"text-xs capitalize text-center text-gray-800"}> {name} </p>
            { /* actual scroll input */ }
            <div
                className='number-scroll-input'
                data-after={"-"+((max+1)*80)+"px"}
                ref={scrollableInputRef}
                onScroll={handleScroll}
            >
                {
                    /*
                     * I could write a one page essay explaining why i put the div.after here but I'm kinda lazy right now and not good with words.
                     * So: TODO: PROPERLY EXPLAIN WHY I PUT div.after HERE !!!
                     * Hopefully you've had the same shitty experience I've had working with the ::after pseudo element.
                     * Maybe looking at the index.tailwind.css file will help.
                    */

                }
                <div className='after' />

                {
                    /* actual elements we get the scrolled value from. */
                    /* add 2 to the max to account for the "--" i place at the top and bottom of the input */
                }
                {
                    Array(max + 2).fill(null).map((...loopArgs) => {
                        const value = loopArgs[1];
                        const displayValue = value - 1;
                        return (
                            <p
                                key={value}
                                className='h-20 w-full text-gray-800 flex items-center font-medium text-4xl justify-center'
                            > <span> { value === 0 || value === max+1 ? "--" : (displayValue < 10 ? "0" : "")+(value-1) } </span> </p>
                        )
                    })
                }
            </div>
        </div>
    )
};

/*

// const [value, setValue] = state;
    // const [editable, setEditable] = useState(false);
    const focusTimeout = useRef();

    // not literal input element
    const scrollableInputRef = useRef();
    const scrollRef = useRef();
    const scrollChildRef = useRef();

    var timeout;

    const handleFocus = () => {
        setEditable(true)
        focusTimeout.current = setTimeout(unfocus, 10000);
    }

    const unfocus = () => {
        setEditable(false);
    }

    const handleChange = (e) => {
        window.clearTimeout(focusTimeout.current);
        let value = e.target.value;
        value = Number(value.replace(/[^0-9]/g, ""));
        value = value > max ? max-1 : value;
        setValue(value);
        focusTimeout.current = setTimeout(unfocus, 4000);
        console.log(value)
    }

    const scroll = () => {
        console.log("scrolling")
        window.clearTimeout(timeout);
        window.clearTimeout(focusTimeout.current);
        timeout = setTimeout(scrollEnd,100);
        focusTimeout.current = setTimeout(unfocus, 4000);
    };

    const scrollEnd = () => {
        const inputHeight = scrollChildRef.current.offsetHeight + 0;
        const scroll = Math.round(scrollRef.current.scrollTop/inputHeight);
        setValue(scroll);
    }

   useEffect(
       () => {
            if(editable) scrollableInputRef.current.focus();
       },
       [editable]
   )

   useEffect(
       () => {
            const inputHeight = scrollChildRef.current.offsetHeight + 0;
            scrollRef.current.scrollTop = inputHeight * value;
            },
       [value]
   )

    return (
        <div>
            <div className="w-full">
                {
                    editable ?
                    <input
                        ref={scrollableInputRef}
                        type={"number"}
                        value={value}
                        onChange={
                            handleChange
                        }
                        onBlur={
                            unfocus
                        }
                        className='w-24 py-2 uppercase font-black text-sm text-center rounded-sm bg-gray-200'
                    /> :
                    <div
                        className='w-24 py-2 uppercase font-black text-sm text-center rounded-sm bg-gray-200'
                        onClick={
                            handleFocus
                        }
                    >
                        { name }
                    </div>

                }
            </div>
            <div
                id={ name }
                onScroll={scroll}
                className="h-60 scroll-smooth no-scroll text-4xl text-center overflow-y-scroll"
                ref={scrollRef}
            > {
                Array(max+2).fill(null).map((x,i) => {
                    return (
                        <p key={ i } ref={i === max-1 ? scrollChildRef : undefined} className="h-2/6 bg-red-100 bg-opacity-0 text-opacity-0 z-0 flex-center"> { i === 0 || i === max+1 ? "--" : i-1 } </p>)
                })
            } </div>


export const NumberInput = () => {

    return (
        ""
    )
}


/*

class TimerControl extends Component {

// static contextType = Context;[]

constructor(props) {
super(props);
this.state = {
scrollStart: null,
scrollEnd: null,
};
this.timeout = null;
this.scrollEnd = this.scrollEnd.bind(this);
this.scroll = this.scroll.bind(this);
}

scroll(e) {

window.clearTimeout(this.timeout);
this.timeout = setTimeout(this.scrollEnd,250);
}

scrollEnd() {
let ele = document.getElementById(this.props.name)
let scroll = ele.scrollTop + 0;
let height = ele.querySelector("p").offsetHeight;
ele.scrollTop = Math.round(scroll/height)*height;
}

render() {

let values = [];

for(let x = 0; x <= this.props.max; x++) {
values.push()
}
values.push(<p key="--" className="h-2/6 flex-center"> -- </p>)


return (




</div>
);
}


}

export default TimerControl;
*/