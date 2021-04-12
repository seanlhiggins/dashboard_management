import { ComponentsProvider,Heading,  Span } from '@looker/components';
import React from 'react';



const Header = (props) => (
        <ComponentsProvider globalStyle={false}>
        <Heading fontWeight="bold">Dashboards of the Month</Heading>
                <Span>{props.tagline}</Span>
        </ComponentsProvider>
    );

// class Header extends React.Component {
//     render(){
//         return (
//             <header className="top">
//                 <h1>Catch 
//                 <span className="ofThe">
//                     <span className="of">of</span> 
//                     <span className="the">the</span> 
//                 </span> 
//                     Day
//                 </h1>
//             <h3 className="tagline">
//                 <span>{this.props.tagline}</span>
//             </h3>
//             </header>
//         ) 
//     }
// }

export default Header;