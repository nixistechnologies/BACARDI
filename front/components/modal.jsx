<div className={active} id="bill" >
<div className="modal-background"></div>
<div className="modal-card">
    <header className="modal-card-head">
    <p className="modal-card-title">Bill</p>
    <button className="delete" onClick={()=>setActive("modal")} aria-label="close"></button>
    </header>
    <section className="modal-card-body">
    <h2 className="_subtitle" style={{fontSize:'20px',fontWeight:600}}>{getValues("patient")}</h2>
    <h2>{getValues("gender")}</h2>
    <table className="table is-fullwidth ctable" style={{marginTop:'20px',marginBottom:'20px'}}>
        <thead>
            <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Discount</th>
                <th></th>
            </tr>
        </thead>
    
    <tbody>
    {mlist.map((e,i)=>{
        return(
            <tr key={e.medicineId} style={{fontSize: "13px",
                letterSpacing: "1px",
                marginBottom: "5px",
                textTransform: "uppercase"
                }}>
                <td style={{fontWeight:'bold'}}>{e.name}</td>
                <td>{e.price}</td>
                <td>{e.qty??1}</td>
                <td>{e.discount??1}</td>
                <td onClick={deletefromtemp.bind(null,i)} style={{cursor:'pointer'}}>
                    <FontAwesomeIcon icon={faTrashAlt} color="red" />
                </td>
            </tr>
        )
    })}
    </tbody>
    </table>
    </section>
    <footer className="modal-card-foot">
    <button className="button is-primary is-small">Save changes</button>
    <button className="button is-small" onClick={()=>setActive("modal")}>Cancel</button>
    </footer>
</div>
</div>