import React, {useRef, useEffect} from 'react';
import { ComponentsProvider, Button, Form, FieldText, FieldTextArea, FieldSelect, Header }  from '@looker/components'

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
                <Header>Add a new dashboard</Header>
                <Form
                    validationMessages={{
                        alpha: { type: 'error', message: 'This is required' },
                        bravo: { type: 'error', message: 'This is another error' },
                    }}
                    >
                    <FieldText placeholder='Name' ref={nameRef} name="name" />
                    <FieldText placeholder='Owner' ref={ownerRef} name='owner' />
                    <FieldText placeholder='Runtime' ref={runtimeRef} name='runtime'/>
                    <FieldText placeholder='Id' required name='id' ref={idRef}/>
                    <FieldText required name='desc' ref={descRef} placeholder='Desc'/>
                    <FieldText rname='image' ref={imageRef} placeholder='Image'/>
                    <FieldSelect ref={statusRef}
                        name='status' 
                        options={[
                            {value:'available', label:'Available'},
                            {value:'unavailable', label:'Deprecated'}]}/>
                    <Button type='submit' onClick={createDash}>+ Add Dash</Button>
                </Form>

            </ComponentsProvider>
        ) 
}

export default AddDashForm;