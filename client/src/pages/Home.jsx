import { useQuery } from '@apollo/client'
import { QUERY_USERS } from '../utils/queries'

function Home() {
    const { loading, data } = useQuery(QUERY_USERS);

    const users = data?.users;

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-2">
            <h1 className="text-center mb-3">
                Users
                <i className="fa-solid fa-users ms-2"></i>
            </h1>
            {users && (
                users.map((user, index) => (
                    <div key={user._id} className="card p-1 mb-2">
                        <div className="card-header">
                            {index + 1} | {user.username}
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">{user.firstName} {user.lastName}</h5>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
};

export default Home;