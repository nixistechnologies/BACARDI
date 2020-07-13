import Link from "next/link";
import Layout from "./layout";

class About extends React.Component{
    render(){
        return(
            <Layout>
            <div>
                <h1>About Page</h1>
                <Link href="/">go to home</Link>
            </div>
            </Layout>

        )
    }
}
export default About;