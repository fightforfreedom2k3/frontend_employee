import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../store"
import { useEffect } from "react";
import { fetchProperties } from "../../../store/propertySlice";

export default function PropertyList() {
    const { properties, loading, error } = useSelector(
        (state: RootState) => state.property,
    );
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchProperties());
    }, [dispatch]);

    console.log(properties);
    return(
        <>
            
        </>
    )
}