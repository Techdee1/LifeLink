package org.interswitch.app.LifeLink.mapper;

import org.interswitch.app.LifeLink.model.Hospital;
import org.interswitch.app.LifeLink.model.HospitalAccount;
import org.interswitch.app.LifeLink.request.HospitalAccountRequest;
import org.interswitch.app.LifeLink.request.HospitalDataRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class HospitalMapper {

    @Autowired
    private ModelMapper mapper;


    public Hospital convertRequestToModel(HospitalDataRequest hospitalDataRequest) {
        if(!Objects.isNull(hospitalDataRequest))
            return mapper.map(hospitalDataRequest, Hospital.class);
        else
           throw new RuntimeException("Hospital Data Request is null.");
    }


    public HospitalDataRequest convertModelToRequest(Hospital hospital) {
        if(!Objects.isNull(hospital))
            return mapper.map(hospital, HospitalDataRequest.class);
        else
            throw new RuntimeException("Hospital Data is null.");
    }
}
