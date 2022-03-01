import { useRouter } from "next/router"

const Selector =()=>{
    const router = useRouter();
    const handleChange=e=>{
        router.push(router.pathname, router.pathname, {locale: e.target.value});
    }
    return(
        <div>
        <select onChange={handleChange} >
            <option value="es">Español</option>
            <option value="en">English</option>
        </select>
        </div>
    )
}

export default Selector