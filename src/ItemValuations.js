import React from "react";
import TableIcons from "./TableIcons";
import MaterialTable from "material-table";
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemAvatar, ListItemText, Divider, Avatar } from '@material-ui/core';
import Link from "./Link";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    nested: {
        paddingLeft: theme.spacing(4),
    }
}));

export default function ItemValuations ({ data, pageSize = 5 }) {
    if (!data) return <div>No valuations available</div>
    const classes = useStyles();
    return (
        <MaterialTable
            title="Valuations"
            icons={TableIcons}
            columns={[
                { title: 'Name', field: 'name' },
                { title: 'Flag', field: 'flag' },
                { title: 'Type', field: 'type' },
                { title: 'Value', field: 'value', defaultSort: 'asc' },
                { title: 'Realm', field: 'connected_realm_id' },
                {
                    title: 'Last Modified',
                    field: 'last_modified',
                    render: rowData => (rowData && 'last_modified' in rowData) ? (new Date(rowData.last_modified*1000).toLocaleString('ru-RU')) : ('')
                }
            ]}
            data={data}
            style={{
                backgroundColor: '#ebe7ee',
                textTransform: "uppercase"
            }}
            options={{
                isLoading: true,
                sorting: true,
                pageSize: pageSize,
                pageSizeOptions: [5,10,20],
                showTitle: false,
                headerStyle: {backgroundColor:'#ebe7ee'}
            }}
            detailPanel={[
                {
                    tooltip: 'Show Info',
                    render: rowData => {
                        if (rowData.details) {
                           return (
                               <div
                                   className={classes.root}
                               >
                                   <Divider/>
                                   <List component="nav" aria-label="secondary" dense={true}>
                                       {Object.entries(rowData.details).map(([k, v]) => {
                                           if (v) {
                                               if (k === "orders") {
                                                   return ''
                                               }
                                               if (k === "reagent_items" || k === "premium_items" || k === "unsorted_items") {
                                                   return (
                                                       <React.Fragment>
                                                           <ListItem>
                                                               <ListItemText primary={`${k.toString().replace(/_/g, ' ')}`}/>
                                                           </ListItem>
                                                           <List component="div" dense={true} disablePadding>
                                                               {v.map(x => (
                                                                   <ListItem className={classes.nested}>
                                                                       <ListItemAvatar>
                                                                           <Avatar alt={x.name.en_GB} src={x.icon} />
                                                                       </ListItemAvatar>
                                                                       <ListItemText primary={<Link href={`/item/${x._id}@${rowData.connected_realm_id}`} color="textPrimary" underline="hover">{x.name.en_GB}</Link>} secondary={`Quantity: ${x.quantity}, Value: ${x.value}`} />
                                                                   </ListItem>
                                                               ))}
                                                           </List>
                                                       </React.Fragment>
                                                   )
                                               }
                                               return (
                                                   <ListItem>
                                                       <ListItemText primary={`${k.toString().replace(/_/g, ' ')} : ${v}`}/>
                                                   </ListItem>
                                               )
                                           }
                                       })}
                                   </List>
                               </div>
                           )
                        }
                    },
                },
            ]}
        />
    )
}
