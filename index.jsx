const StateStore = [];
let StateCounter = 0;
let StoreAllowed = false;
let jsxCalled = undefined;
const React = {

    createElement: (element,props,...whatever) =>{
        if(typeof(element)==="function")
        {
            return(element())
        }
        if(typeof(element)==="string")
        {
            const jsxToReturn = {
                type:element,
                props:{
                    children:whatever,
                    ...props,
                }
            };
            return jsxToReturn;
        }
    },

    render: (JSXInitiallyReceived,InitialDOMRef) =>{
        jsxCalled = JSXInitiallyReceived;
        StoreAllowed=true;
        reRenderCallback = (JSXReceived,DOMRef)=>{
            let JSXToRender = {};
            if(typeof(JSXReceived)==="object")
            {
                JSXToRender = JSXReceived;
            }
            else if(typeof(JSXReceived)==="function")
            {
                JSXToRender = JSXReceived();
            }
            if(JSXToRender.props)
            {
                const ChildrenArrayOfProps = Object.entries(JSXToRender.props);
                const ChildrenElement = document.createElement(JSXToRender.type);
                for(let o=0; o<ChildrenArrayOfProps.length;o++)
                {
                    const [nomeAtributo,valorAtributo] = ChildrenArrayOfProps[o];
                    if(nomeAtributo!=="children" && typeof(valorAtributo)!=="function")
                    {
                        ChildrenElement.setAttribute(nomeAtributo,valorAtributo)
                    }
                    else if(typeof(valorAtributo)==="function")
                    {
                        ChildrenElement.addEventListener(nomeAtributo.replace("on",""),valorAtributo)
                    }
                }
                if(JSXToRender.props && JSXToRender.props.children)
                {

                    for(let childrenCounter = 0; childrenCounter<JSXToRender.props.children.length; childrenCounter++)
                    {
                        if(typeof(JSXToRender.props.children[childrenCounter])==="object")
                            reRenderCallback(JSXToRender.props.children[childrenCounter],ChildrenElement);
                        else 
                            ChildrenElement.innerHTML = JSXToRender.props.children[childrenCounter];
                    }
                }
                DOMRef.appendChild(ChildrenElement);
                return DOMRef;
            }
        }
        reRenderCallback(JSXInitiallyReceived,InitialDOMRef);
    },

    reRender:() => {
        StateCounter = 0;
        while (root.lastElementChild) {
            root.removeChild(root.lastElementChild);
        }
        React.render(jsxCalled,root);
    },

    useState: (initialVal) => {
        let valorMemoizado = StateStore[StateCounter] || initialVal;
        let contadorMemoizado = StateCounter;
        let ActionsThatAffectStore = [()=>{},(_newVal)=>{}];
        if(StoreAllowed)
            ActionsThatAffectStore = [()=>{StateCounter++},(_newVal)=>{StateStore[contadorMemoizado] = _newVal}];
        const setValue = (newVal) =>{
            ActionsThatAffectStore[1](newVal);
            console.log(StateStore);
            React.reRender()
        }
        ActionsThatAffectStore[0]();
        return [valorMemoizado,setValue];
    }

}

const Componente = ()=>
{
    const [valor,setValor] = React.useState("valor inicial");
    const [valor2,setValor2] = React.useState("valor");
    console.log(<div></div>);
    console.log(<div id="componente">
    <h1>Essa é minha página usando meu próprio framework :D</h1>
    <h2>valor 1:{valor}</h2>
    <h2>valor 2:{valor2}</h2>
    <input value={valor} onchange={(e)=>{setValor(e.target.value)}} id="teste"/>
    <input type="text" value={valor2} onchange={(e)=>setValor2(e.target.value)}/>
    <button onclick={()=>setValor("")}>Texto</button>
</div>);
    return(
        <div id="componente">
            <h1>Essa é minha página usando meu próprio framework :D</h1>
            <h2>valor 1:{valor}</h2>
            <h2>valor 2:{valor2}</h2>
            <input value={valor} onchange={(e)=>{setValor(e.target.value)}} id="teste"/>
            <input type="text" value={valor2} onchange={(e)=>setValor2(e.target.value)}/>
            <button onclick={()=>setValor("")}>Texto</button>
        </div>
    )
}
React.render(Componente,root)