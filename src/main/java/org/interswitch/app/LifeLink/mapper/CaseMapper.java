package org.interswitch.app.LifeLink.mapper;

import org.interswitch.app.LifeLink.model.Case;
import org.interswitch.app.LifeLink.request.CaseRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class CaseMapper {

    @Autowired
    private ModelMapper mapper;


    public CaseRequest convertToRequest(Case user_case) {
        if(!Objects.isNull(user_case))
            return mapper.map(user_case, CaseRequest.class);
        else
            throw new RuntimeException("Case not found.");
    }

    public Case convertToModel(CaseRequest caseRequest) {
        if(!Objects.isNull(caseRequest))
            return mapper.map(caseRequest, Case.class);
        else
            throw new RuntimeException("Case not found.");
    }

}
