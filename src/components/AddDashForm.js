import React, {useRef, useEffect} from 'react';
import { ComponentsProvider, Button, Form, FieldText, FieldTextArea, FieldSelect }  from '@looker/components'

const AddDashForm = ({addDash}) => {
    const nameRef = React.useRef();
    const runtimeRef = React.useRef();
    const idRef = React.useRef();
    const statusRef = React.useRef();
    const showRuntimeRef = React.useRef();
    const descRef = React.useRef();
    const imageRef = React.useRef();
    const ownerRef = React.useRef();



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
        e.reset();
    }

        return (
            <ComponentsProvider>
                <Form
                    validationMessages={{
                        alpha: { type: 'error', message: 'This is required' },
                        bravo: { type: 'error', message: 'This is another error' },
                    }}
                    >
                    <FieldText placeholder='Name' ref={nameRef} name="name" />
                    <FieldText placeholder='Owner' ref={ownerRef} name='owner' />
                    <FieldText placeholder='Runtime' ref={runtimeRef} name='runtime'/>
                    <FieldText required name='id' ref={idRef}/>
                    <FieldText required name='desc' ref={descRef} placeholder='Desc'/>
                    <FieldText rname='image' ref={imageRef} placeholder='Image'/>
                    <FieldSelect ref={statusRef}
                        name='status' 
                        options={[
                            {value:'available', label:'Available'},
                            {value:'unavailable', label:'Deprecated'}]}/>
                    <Button type='submit' onClick={createDash}>+ Add Dash</Button>
                </Form>
                {/* <InputText autoResize required name='name' ref={nameRef}  type='text' placeholder='Name' /> */}
                {/* <InputText name='runtime' ref={runtimeRef}  type='text' placeholder='Runtime' /> */}
                {/* <InputText required name='id' ref={idRef}  type='text' placeholder='Dashboard ID' />
                <InputText name='owner' ref={ownerRef}  type='text' placeholder='Owner' />
                <Select name='status'  ref={statusRef}
                    options={[
                        {value:'available', label:'Available'},
                        {value:'unavailable', label:'Deprecated'}]}/>
                <TextArea required name='desc' refs={descRef}  type='text' placeholder='Desc'></TextArea>
                <InputText required name='image'  ref={imageRef} type='text' placeholder='Image' /> */}
            </ComponentsProvider>
        ) 
}

export default AddDashForm;