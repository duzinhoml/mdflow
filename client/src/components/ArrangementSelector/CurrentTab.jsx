import { useCreateSection } from "../../lib/constants";

function CurrentTab({ currentTab, screenWidth }) {
    const handleInputSelection = useCreateSection();

    return (
        <div className="collapse" id={`collapseExample${currentTab?.id}`}>
            <div className="p-2 row m-0 pt-0">
                {currentTab?.children.map(child => (
                    <button 
                        key={child.label} 
                        type="submit"
                        className="btn btn-dark m-1 flex-grow-1 col-3" 
                        style={{
                            color: child.color,
                            borderColor: child.color,
                            fontSize: screenWidth >= 768 ? '20px' : '16px',
                            textShadow: '2px 2px 4px black'
                        }}
                        onClick={() => handleInputSelection(currentTab, child)}
                    >
                        {child.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CurrentTab;