import Notes from './Notes';

export const Home = (props) => {
    // const {showAlert}=props.showAlert
    return (
        <div> 
            <Notes showAlert={props.showAlert}/>
        </div>
    )
}