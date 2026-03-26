package org.interswitch.app.LifeLink.pagination;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class CasePageRequest {


    private int pageNo = 1;
    private int pageSize = 10;
    private Sort.Direction direction = Sort.Direction.ASC;
    private String sortBy = "caseId";


    public Pageable pageRequest(int pageNo,int pageSize) {
        pageNo = Math.max(this.pageNo,pageNo);
        pageSize = Math.max(this.pageSize,pageSize);
        return PageRequest.of(pageNo,pageSize, direction, sortBy);
    }
}
