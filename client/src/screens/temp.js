<div>
                            {/* Selected Person: {this.state.newPerson.relnWith} */}

                                <List id="viewNodeInfo" style={{display : this.state.viewNodeInfo}}>
                                    {
                                        this.state.selected.map(
                                            (item) =>
                                                 <ListItem>
                                                     <ListItemText>
                                                         {item[0] + ': ' + item[1]}
                                                    </ListItemText>
                                                </ListItem>
                                        )
                                    }
                                </List>

                                <List id="updateNodeForm" style={{display : this.state.updateNodeForm}}>
                                    {
                                        this.state.selected.map(
                                            (item) => <TextField label={item[0]} value={item[1]}> </TextField>
                                        )
                                    }
                                </List>

                            <div id="addRelatedNode" style={{display : this.state.addReln}}>
                                <TextField
                                    label="New Person"
                                    value={this.state.newPerson.name}
                                    onChange={this.typeName}
                                />
                                <InputLabel >What is {this.state.newPerson.relnWith}'s relationship to {this.state.newPerson.name} </InputLabel>
                                <Select
                                    value={this.state.newPerson.relnType}
                                    onChange={this.selectRelationship}
                                >
                                    <MenuItem value={'spouse'}>Spouse</MenuItem>
                                    <MenuItem value={'parent'}>Parent</MenuItem>
                                </Select>
                                <Button onClick={this.createNode}>Create Node</Button>
                                {this.state.confirm_msg}
                            </div>

                            <Button onClick={() => this.handleFormNavigation('updateNodeForm')}>
                                {this.state.updateNodeText}
                            </Button>
                            <Button onClick={() => this.handleFormNavigation('addReln')}>
                                {this.state.addRelnText}
                            </Button>
                        </div>