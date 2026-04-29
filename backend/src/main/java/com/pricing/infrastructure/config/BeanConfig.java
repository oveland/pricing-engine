package com.pricing.infrastructure.config;

import com.pricing.application.usecase.FindApplicablePriceUseCaseImpl;
import com.pricing.domain.port.input.FindApplicablePriceUseCase;
import com.pricing.domain.port.output.PriceRepositoryPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig {
    @Bean
    public FindApplicablePriceUseCase findApplicablePriceUseCase(PriceRepositoryPort priceRepository) {
        return new FindApplicablePriceUseCaseImpl(priceRepository);
    }
}
