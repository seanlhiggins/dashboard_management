import React, {useRef, useEffect} from 'react';
import { ComponentsProvider, Button, Box, FieldCheckbox, Flex, FlexItem, Select, InputText, Divider, SpaceVertical, TextArea }  from '@looker/components'

const AddDashForm = ({addDash}) => {
    const nameRef = useRef();
    const runtimeRef = useRef();
    const idRef = useRef();
    const statusRef = useRef();
    const showRuntimeRef = useRef();
    const descRef = useRef();
    const imageRef = useRef();
    const ownerRef = useRef();



    const createDash = (e) => {
        e.preventDefault()
        e.persist()

        const dash = {
            name: nameRef.current.value,
            runtime: parseFloat(runtimeRef.current.value),
            id: parseFloat(idRef.current.value),
            status: statusRef.current.value,
            desc: descRef.current.value,
            image: imageRef.current.value,
            owner: ownerRef.current.value
        }
        addDash(dash)
        e.currentTarget.reset();
    }

        return (
            <ComponentsProvider>
                <InputText required name='name' ref={nameRef} type='text' placeholder='Name' />
                <InputText name='runtime' ref={runtimeRef} type='text' placeholder='Runtime' />
                <InputText required name='id' ref={idRef} type='text' placeholder='Dashboard ID' />
                <InputText name='owner' ref={ownerRef} type='text' placeholder='Owner' />
                <Select name='status' ref={statusRef}
                    options={[
                        {value:'available', label:'Available'},
                        {value:'unavailable', label:'Deprecated'}]}/>
                <TextArea required name='desc' ref={descRef} type='text' placeholder='Desc'></TextArea>
                <InputText required name='image' ref={imageRef} type='text' placeholder='Image' />
                <Button type='submit' onClick={createDash}>+ Add Dash</Button>
            </ComponentsProvider>
        ) 
}

export default AddDashForm;