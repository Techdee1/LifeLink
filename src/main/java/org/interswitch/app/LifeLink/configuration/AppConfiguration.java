package org.interswitch.app.LifeLink.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.interswitch.app.LifeLink.model.Hospital;
import org.interswitch.app.LifeLink.model.HospitalAccount;
import org.interswitch.app.LifeLink.request.HospitalAccountRequest;
import org.interswitch.app.LifeLink.request.HospitalDataRequest;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AppConfiguration {


    @Bean
    public ModelMapper getMapper() {
        ModelMapper mapper = new ModelMapper();
        mapper.createTypeMap(HospitalAccountRequest.class, HospitalAccount.class);
        return mapper;
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);

        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJacksonJsonRedisSerializer(new tools.jackson.databind.ObjectMapper()));
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJacksonJsonRedisSerializer(new tools.jackson.databind.ObjectMapper()));


        template.afterPropertiesSet();
        // Configure the RedisTemplate as needed (e.g., set connection factory, serializers)
        return template;
    }

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .build();
    }
}
