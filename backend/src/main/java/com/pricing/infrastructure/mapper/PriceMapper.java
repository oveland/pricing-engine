package com.pricing.infrastructure.mapper;

import com.pricing.domain.model.BrandId;
import com.pricing.domain.model.DateRange;
import com.pricing.domain.model.Money;
import com.pricing.domain.model.Price;
import com.pricing.domain.model.ProductId;
import com.pricing.infrastructure.adapter.input.rest.PriceResponseDto;
import com.pricing.infrastructure.adapter.output.jpa.PriceEntity;
import java.time.format.DateTimeFormatter;
import org.springframework.stereotype.Component;

@Component
public class PriceMapper {

    public Price toDomain(final PriceEntity entity) {
        return new Price(
                new BrandId(entity.getBrandId()),
                new ProductId(entity.getProductId()),
                entity.getPriceList(),
                new DateRange(entity.getStartDate(), entity.getEndDate()),
                entity.getPriority(),
                new Money(entity.getPrice(), entity.getCurrency()));
    }

    public PriceResponseDto toResponseDto(final Price price) {
        final DateRange dateRange = price.getDateRange();
        final Money money = price.getMoney();

        return new PriceResponseDto(
                price.getProductId().value(),
                price.getBrandId().value(),
                price.getPriceList(),
                dateRange.startDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                dateRange.endDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                money.amount(),
                money.currency());
    }
}
