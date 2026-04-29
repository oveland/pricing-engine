package com.pricing.infrastructure.mapper;

import com.pricing.domain.model.BrandId;
import com.pricing.domain.model.DateRange;
import com.pricing.domain.model.Money;
import com.pricing.domain.model.Price;
import com.pricing.domain.model.ProductId;
import com.pricing.infrastructure.adapter.input.rest.PriceResponseDto;
import com.pricing.infrastructure.adapter.output.jpa.PriceEntity;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class PriceMapper {
    
    public Price toDomain(PriceEntity entity) {
        return new Price(
                new BrandId(entity.getBrandId()),
                new ProductId(entity.getProductId()),
                entity.getPriceList(),
                new DateRange(entity.getStartDate(), entity.getEndDate()),
                entity.getPriority(),
                new Money(entity.getPrice(), entity.getCurrency())
        );
    }

    
    public PriceResponseDto toResponseDto(Price price) {
        return new PriceResponseDto(
                price.getProductId().value(),
                price.getBrandId().value(),
                price.getPriceList(),
                price.getDateRange().startDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                price.getDateRange().endDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                price.getMoney().amount(),
                price.getMoney().currency()
        );
    }
}
