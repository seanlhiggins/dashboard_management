import React from 'react';

const StorePicker = () => {
    
    const myInput = React.createRef();
    const goToStore = (event) => {
        event.preventDefault();
        const storeName =this.myInput.current.value;
        this.props.history.push(`/store/${storeName}`)

    }

        return (
        <form className="store-selector" onSubmit={this.goToStore}>
            <h2>Please Enter A Store</h2>
            <input 
                ref={myInput}
                type="text" 
                required 
                placeholder="Store Name"/>
            <button type="submit">Visit Store ➢</button>
        </form>

        )
}

export default StorePicker;