package com.pricing.domain.model;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class Price {
    private final BrandId brandId;
    private final ProductId productId;
    private final int priceList;
    private final DateRange dateRange;
    private final int priority;
    private final Money money;

    public Price(BrandId brandId, ProductId productId, int priceList,
                 DateRange dateRange, int priority, Money money) {
        this.brandId = brandId;
        this.productId = productId;
        this.priceList = priceList;
        this.dateRange = dateRange;
        this.priority = priority;
        this.money = money;
    }

    
    public boolean isApplicableAt(LocalDateTime date) {
        return dateRange.contains(date);
    }

    
    public boolean hasHigherPriorityThan(Price other) {
        return this.priority > other.priority;
    }

    
    public static Optional<Price> withHighestPriority(List<Price> prices) {
        return prices.stream()
                .max(Comparator.comparingInt(Price::getPriority));
    }

    public BrandId getBrandId() {
        return brandId;
    }

    public ProductId getProductId() {
        return productId;
    }

    public int getPriceList() {
        return priceList;
    }

    public DateRange getDateRange() {
        return dateRange;
    }

    public int getPriority() {
        return priority;
    }

    public Money getMoney() {
        return money;
    }
}
