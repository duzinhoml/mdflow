function ProgressBar({ currentStep }) {

    return (
        <div className={`position-relative m-4 mx-auto`} style={{ width: '50%' }}>
            <div 
                className="progress" 
                role="progressbar" 
                aria-valuenow={currentStep === 1 ? "50" : "100"} 
                aria-valuemin="0" 
                aria-valuemax="100" 
                style={{ height: '1px' }}
            >
                <div 
                    className="progress-bar" 
                    style={{ 
                        background: 'linear-gradient(to right, hsl(264, 100%, 32%), hsl(264, 100%, 72%))',
                        width: currentStep === 1 ? '50%' : '100%', 
                        transition: 'width 0.5s ease-in-out'
                    }}
                ></div>
            </div>
            <button 
                type="button" 
                className='position-absolute top-0 start-0 translate-middle btn btn-sm rounded-pill' 
                style={{ 
                    backgroundColor:'hsl(264, 100%, 72%)',
                    width: '2rem', 
                    height: '2rem' }}
            >1</button>
            <button 
                type="button" 
                className='position-absolute top-0 start-100 translate-middle btn btn-sm rounded-pill' 
                style={{
                    backgroundColor: currentStep === 2? 'hsl(264, 100%, 72%)' : '#c2c2c2',
                    width: '2rem', 
                    height: '2rem' }}
            >2</button>
        </div>
    );
};

export default ProgressBar;